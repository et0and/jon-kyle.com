<template>
  <div class="content-entry copy">
    <section>
      <h2 v-if="title">{{title}}</h2>
      <router-link :to="entry.url"><time :datetime="entry.date">{{entry.dateFormatted}}</time></router-link>
    </section>
    <ol v-if="!truncate && index">
      <li v-for="text in index" v-html="text"></li>
    </ol>
    <div v-if="entry._loaded" class="copy" ref="copy" v-html="copy" />
    <PlaceholderText v-else class="copy" />
  </div>
</template>

<script>
import implicitFigures from 'markdown-it-implicit-figures'
import PlaceholderText from '@/components/PlaceholderText'
import namedHeadings from 'markdown-it-named-headings'
import modifyToken from 'markdown-it-modify-token'
import html5Embed from 'markdown-it-html5-embed'
import footnote from 'markdown-it-footnote'
import scrollMonitor from 'scrollmonitor'
import mediumZoom from 'medium-zoom'
import markdownIt from 'markdown-it'

const mdMicro = markdownIt()
const md = markdownIt({
  html: true,
  linkify: true,
  modifyToken: (token, env) => {
    switch (token.type) {
      case 'image':
        if (token.attrObj.src && token.attrObj.src.substring(0, 4) !== 'http') {
          token.attrObj['data-src'] = `https://raw.githubusercontent.com/jondashkyle/archive/drafts${env.url}/${token.attrObj.src}`
          token.attrs.splice(0, 1)
          delete token.attrObj.src
        }
        break
      case 'link_open':
        if (token.href && token.href.substring(0, 4) === 'href') token.attrObj.target = '_blank'
        break
    }
  },
})
  .use(modifyToken)
  .use(namedHeadings)
  .use(implicitFigures)
  .use(html5Embed, {
    html5embed: {
      useImageSyntax: false,
      useLinkSyntax: true,
      isAllowedHttp: true,
      renderFn(properties, attributes) {
        switch (properties.mediaType) {
          case 'video':
            return `
            <figure class="video">
              <video
                data-src="${properties.url}"
                poster="${properties.url.replace('.mp4', '.jpg')}"
                preload="none"
                controls
              ></video>
            </figure>
          `
          case 'audio':
            return `<audio src="${properties.url}" controls></audio>`
        }
      },
    },
  })
  .use(footnote)

export default {
  name: 'ContentEntry',
  components: { PlaceholderText },
  props: {
    entry: {
      type: Object,
      default: { },
    },
    truncate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      watching: false,
      watchers: [],
      links: [],
    }
  },
  created() {
    if (!this.entry._loaded) {
      this.$store.dispatch('fetchEntry', this.entry.src)
    }
  },
  mounted() {
    this.contentUpdated()
  },
  beforeDestroy() {
    this.removeWatchers()
    this.removeListeners()
  },
  watch: {
    'entry.content': 'contentUpdated',
  },
  computed: {
    title() {
      const { content } = this.entry
      if (content && content.substring(0, 2) === '# ') {
        return content.substring(2, content.indexOf('\n'))
      }
    },
    index() {
      if (!this.entry.index) return
      return this.entry.index
        .map(text => mdMicro.render(text))
    },
    copy() {
      let { content, name, url } = this.entry

      if (content) {
        if (this.title) {
          content = content.substring(content.indexOf('\n'), content.length).trim()
        }

        if (this.truncate) {
          content = content.replace(
            /<!-- more -->([\s\S]*|$)/gm,
            `<a href="${url}" class="continue-reading">Continue reading</a>`,
          )
        }

        let output = md
          .render(content, { url: this.entry.url })
          .replace(/\[(.*?)\]/g, '($1)')
          .replace(/(\(\^.*?\))/g, '')
          .replace(/href="#(.*?)/g, `href="#${name}-$1`)
          .replace(/id="(.*?)/g, `id="${name}-$1`)

        output = output
          .replace(/\n<p>\s*<\/p>\n/g, '')
          .replace(/<p>\s*(<figure class="video">([\s\S]*|$)<\/figure>)\s*<\/p>/g, '$1')
          .replace(
            /<figure><img alt="c:([\S]*) r:([\S]*)" data-src="([\S|.]*)"/g,
            '<figure class="ratio" style="grid-column: $1"><div style="padding-bottom: $2%;"></div><img data-src="$3" ',
          )
          .replace(
            /<figure><img data-src="([\S|.]*)" alt="c:([\S]*)"/g,
            '<figure style="grid-column: $2;"><img data-src="$1" ',
          )
          .replace(
            /<figure><img alt="r:([\S]*)" data-src="([\S|.]*)"./g,
            '<figure class="ratio"><div style="padding-bottom: $1%;"></div><img data-src="$2">',
          )
          .replace(/(?=.*?<figure class=")(?=.*?png).*?(class=")/gm, '<figure class="transparent ')

        return output
      }
    },
  },
  methods: {
    removeWatchers() {
      this.watchers.forEach(watcher => watcher.destroy())
      this.watchers = []
      this.watching = false
    },
    addWatchers() {
      if (!this.watching && this.entry.content) {
        this.watching = true
        const els = [...this.$refs.copy.querySelectorAll('[data-src]')]
        els.forEach((el) => {
          const watcher = scrollMonitor.create(el, 200)
          mediumZoom(el, { background: '#000' })
          watcher.on('enterViewport', () => {
            if (!el.getAttribute('src')) {
              el.setAttribute('src', el.getAttribute('data-src'))
            }
          })
          this.watchers.push(watcher)
        })
      }
    },
    navigate(event) {
      let target = event.target
      let i = 0
      // Go throught 5 parents max to find a tag
      while (i < 5 && !(target instanceof HTMLAnchorElement) && target.parentNode) {
        target = target.parentNode
        i++
      }
      // If target is still not a link, ignore
      if (!(target instanceof HTMLAnchorElement)) return
      const href = target.getAttribute('href')
      // Get link target, if local link, navigate with router link
      if (href && href[0] === '/') {
        event.preventDefault()
        this.$router.push(href)
      }
      // If Google Analytics is activated & is external link
      else if (this.$ga) {
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
        // this.$ga('send', 'event', 'Outbound Link', 'click', target.href)
      }
    },
    contentUpdated() {
      this.removeListeners()
      this.removeWatchers()
      this.$nextTick(() => {
        this.addListeners()
        this.addWatchers()
      })
    },
    addListeners() {
      this.links = this.$el.getElementsByTagName('a')
      for (let i = 0; i < this.links.length; i++) {
        if (this.links[i].getAttribute('href').substring(0, 4) === 'http') {
          this.links[i].setAttribute('target', '_blank')
        }
        this.links[i].addEventListener('click', this.navigate, false)
      }
    },
    removeListeners() {
      for (let i = 0; i < this.links.length; i++) {
        this.links[i].removeEventListener('click', this.navigate, false)
      }
      this.links = []
    },
  },
}
</script>

<style scoped>
.content-entry {
  padding: 1rem;
}
</style>
