<template>
  <main>
    <GlobalHeader />
    <div class="content">
      <router-view />
    </div>
  </main>
</template>

<script>
import removeMarkdown from 'remove-markdown'
import GlobalHeader from './components/GlobalHeader'
import { mixin } from './store'

export default {
  name: 'Site',
  mixins: [mixin],
  components: { GlobalHeader },
  mounted() {
    this.$store.dispatch('fetchOptions')
    this.$store.dispatch('fetchPage', '/entries')
    this.$store.dispatch('fetchInstagram')
    if (this.$route.path !== '/' && this.$route.path !== '/index') {
      this.$store.dispatch('fetchPage', this.$route.path)
    }
    setTimeout(() => { window.prerenderReady = true }, 500)
  },
  watch: {
    '$route.path': function (value) {
      if (this.$route.path !== '/' && this.$route.path !== '/index') {
        this.$store.dispatch('fetchPage', this.$route.path)
      }
    }
  },
  metaInfo() {
    const image = this.page && this.page.image
      ? this.page.image
      : 'https://jon-kyle.com/social.png'

    const metaTags = [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        property: 'og:type',
        content: 'website',
        vmid: 'og:type',
      },
      {
        property: 'og:title',
        content: this.page ? this.page.title || this.page.dateFormatted : false,
        template: titleChunk => (titleChunk ? `${titleChunk} / Jon-Kyle` : 'Jon-Kyle'),
        vmid: 'og:title',
      }
    ]

    if (this.page && this.page.content && this.$route && this.$route.name === 'entry') {
      const description = this.page.content
        .split('\n')
        .slice(0, 6)
        .map(str => str.trim())
        .join(' ')
        .replace(/\>/g, '')
      const formatted = removeMarkdown(description)

      metaTags.push({
        name: 'description',
        content: formatted,
        vmid: 'description',
      },
      {
        property: 'og:description',
        content: formatted,
        vmid: 'og:description',
      })
    }

    if (image) {
      metaTags.push({
        name: 'twitter:card',
        content: 'summary_large_image',
        vmid: 'twitter:card',
      })
      metaTags.push({
        name: 'og:card',
        content: 'summary_large_image',
        vmid: 'og:card',
      })
      metaTags.push({
        name: 'twitter:image',
        content: image,
        vmid: 'twitter:image',
      })
      metaTags.push({
        property: 'og:image',
        content: image,
        vmid: 'og:image',
      })
    }

    if (this.isNotFound) {
      metaTags.push({
        property: 'prerender-status-code',
        content: 404,
        vmid: 'prerender-status-code',
      })
    }
    
    return {
      title: this.page ? this.page.title || this.page.dateFormatted : false,
      titleTemplate: titleChunk => (titleChunk ? `${titleChunk} / Jon-Kyle` : 'Jon-Kyle'),
      meta: metaTags,
      style: [{
        cssText: this.$store.state.options.night ? ':root { --fg: 255, 255, 255; --bg: 0, 0, 0 }' : '',
      }],
    }
  },
}
</script>

<style>
:root {
  --bg: 255, 255, 255;
  --fg: 0, 0, 0;
  --sans: "Lars Sans", sans-serif;
  --mono: "Lars Mono", menlo, monaco, monospace;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -moz-font-feature-settings:"kern" 1;
  -ms-font-feature-settings:"kern" 1;
  -o-font-feature-settings:"kern" 1;
  -webkit-font-feature-settings:"kern" 1;
  font-feature-settings:"kern" 1;
  font-kerning: normal;
}

body {
  background: rgb(var(--bg));
  color: rgb(var(--fg));
  font-size: 1rem;
  line-height: 1.5;
  font-family: var(--sans);
}

::-moz-selection { background: rgba(127, 127, 127, 0.5) }
::selection { background: rgba(127, 127, 127, 0.5) }

main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
}

.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 4rem;
}

/* Copy */

h1, h2, h3, h4 {
  font-size: inherit;
  font-weight: normal;
}

a {
  color: inherit;
}

.continue-reading {
  text-decoration: none;
  display: block;
  padding: 0.5rem 1rem;
  line-height: 1;
  border-radius: 3rem;
  border: 1px solid rgb(var(--fg));
  text-align: center;
  width: 100%;
  max-width: 15rem;
  margin: 0 auto;
}

.mono,
code {
  font-family: var(--mono);
}

.copy {
  --col: 4 / 10;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  align-items: start;
  grid-gap: 1rem;
  grid-column: 1 / -1;
  word-break: break-word;
}

@media (max-width: 950px) {
  .copy { --col: 3 / 11 }
}

@media (max-width: 750px) {
  .copy { --col: 2 / 12 }
}

@media (max-width: 600px) {
  .copy { --col: 1 / -1; --wmx: 100%; }
  .copy figure { grid-column: 1 / -1 !important; }
}

.copy h1,
.copy h2,
.copy h3,
.copy p,
.copy ul,
.copy ol,
.copy section,
.copy .footnotes,
.copy blockquote {
  grid-column: var(--col);
}

.copy h2:not(:first-child),
.copy h3:not(:first-child) {
  text-indent: -1rem;
  padding-left: 1rem;
  margin-top: 2rem;
}

.copy ul li,
.copy ol li {
  position: relative;
  list-style: none;
  padding-left: 2rem;
}

.copy ul li:before {
  content: '○';
  position: absolute;
  left: 0;
  top: -0.05em;
  font-size: 1.5em;
  line-height: 1;
  text-indent: 0;
}

.copy ol li:before {
  position: absolute;
  text-indent: 0;
  top: 0;
  left: 0;
}

.copy ol li:nth-child(1):before { content: '1' }
.copy ol li:nth-child(2):before { content: '2' }
.copy ol li:nth-child(3):before { content: '3' }
.copy ol li:nth-child(4):before { content: '4' }
.copy ol li:nth-child(5):before { content: '5' }
.copy ol li:nth-child(6):before { content: '6' }
.copy ol li:nth-child(7):before { content: '7' }
.copy ol li:nth-child(8):before { content: '8' }
.copy ol li:nth-child(9):before { content: '9' }
.copy ol li:nth-child(10):before { content: '10' }
.copy ol li:nth-child(11):before { content: '11' }
.copy ol li:nth-child(12):before { content: '12' }

.copy hr {
  grid-column: 1 / -1;
  border: 0;
  height: 2rem;
}

.copy pre {
  overflow: auto;
  grid-column: 3 / 11;
  background: rgba(var(--fg), 0.1);
  padding: 1rem;
  max-height: 20rem;
}

.copy figure {
  grid-column: 3 / 11;
  width: 100%;
}

.copy figure img {
  display: block;
  height: auto;
  width: 100%;
}

.copy figure img:not([src]) { opacity: 0 }
.copy figure.ratio { position: relative  }
.copy figure:not(.transparent):not(.video) { background: rgba(var(--fg), 0.2) }
.copy figure.ratio img { height: 0; position: absolute; top: 0; left: 0; height: 100%; width: 100%; }

.copy sup { vertical-align: top }
.copy .footnote-ref a { font-family: var(--mono); text-decoration: none; margin-top: }
.copy a.footnote-backref { text-decoration: none; color: rgba(var(--fg), 0.2) }
.copy a.footnote-backref:hover { color: rgba(var(--fg), 1) }
.copy .footnotes blockquote { margin-left: -1rem; text-indent: 0; padding-left: 1rem; }

.copy a[href*="http"]:after {
  content: '→';
  font-style: normal;
  display: inline-block;
  transform: rotate(-45deg);
  font-family: var(--mono);
  text-indent: 0;
}

.copy blockquote {
  position: relative;
  margin-left: 0.4rem;
  padding-left: 1.6rem;
  border-left: 1px solid rgb(var(--fg));
}

.video {
  background: #000;
  height: 0;
  width: 100%;
  padding-bottom: 56.25%;
  position: relative;
}

.video video {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  outline: 0;
}

::-webkit-input-placeholder { color: rgba(var(--fg), 0.25); opacity: 1 }
::-moz-placeholder { color: rgba(var(--fg), 0.25); opacity: 1 }
:-ms-input-placeholder { color: rgba(var(--fg), 0.25); opacity: 1 }
:-moz-placeholder { color: rgba(var(--fg), 0.25); opacity: 1 }

@font-face {
  font-family: 'Lars Sans';
  src: url('assets/fonts/Lars-Light.woff2') format('woff2'), url('assets/fonts/Lars-Light.woff') format('woff');
}

@font-face {
  font-family: 'Lars Sans';
  font-style: italic;
  src: url('assets/fonts/Lars-LightItalic.woff2') format('woff2'), url('assets/fonts/Lars-LightItalic.woff') format('woff');
}

@font-face {
  font-family: 'Lars Mono';
  src: url('assets/fonts/Lars-Mono.woff2') format('woff2'), url('assets/fonts/Lars-Mono.woff') format('woff');
}
</style>
