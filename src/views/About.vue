<template>
  <WrapperStandard>
    <div class="about" v-if="content">
      <div class="social-container">
        <div class="social">
          <img :src="image" />
          <div class="meta">
            <div>{{page.location}}</div>
            <div v-html="contact" />
            <div v-html="social" />
          </div>
        </div>
      </div>
      <Hooper v-if="slideshow" :settings="hooperSettings">
        <slide>One</slide>
        <slide>Two</slide>
      </Hooper>
      <div class="columns">
        <section v-for="section in content" v-html="section"></section>
      </div>
    </div>
    <LoadingIndicator v-else />
  </WrapperStandard>
</template>

<script>
import WrapperStandard from '@/components/WrapperStandard'
import LoadingIndicator from '@/components/LoadingIndicator'
import { Hooper, Slide } from 'hooper'
import 'hooper/dist/hooper.css'
import markdownIt from 'markdown-it'
import { mixin } from '../store'

const md = new markdownIt()

export default {
  name: 'About',
  mixins: [mixin],
  components: { WrapperStandard, LoadingIndicator, Hooper, Slide },
  metaInfo() {
    return { title: 'About' }
  },
  data () {
    return {
      slideshow: false,
      hooperSettings: {
        infiniteScroll: true,
        wheelControl: false
      }
    }
  },
  computed: {
    image () {
      const { location, branch } = this.$store.state.api
      return `${location + branch}/jon-kyle.jpg`
    },
    contact () {
      return md.render(this.page.contact)
    },
    social () {
      return md.render(this.page.social)
    },
    content() {
      if (typeof this.page !== 'object' || !this.page.content) return
      const { location, branch } = this.$store.state.api
      return this.page.content
        .split('###')
        .filter(str => str)
        .map((section) => {
          section = section.trim().replace(/^\# .*\n\n/g, '')
          return md.render(section)
        })
    },
  },
}
</script>

<style scoped>
.about {
  padding: 1rem;
}

.columns {
  margin-top: 5rem;
  columns: auto 15rem;
}

.columns section {
  break-inside: avoid;
  margin-bottom: 2rem;
}

.columns >>> ul {
  margin-top: 1rem;
  list-style: none;
}

.columns >>> li {
  text-indent: -1rem;
  padding-left: 1rem;
}

.hooper {
  cursor: grab;
  outline: 0;
  height: auto;
  width: 100%;
  margin: 5rem 0;
  background: rgb(var(--fg));
  color: rgb(var(--bg));
}

.hooper-slide {
  height: 0;
  width: 100%;
  padding-bottom: 56.25%;
}

.social {
  display: flex;
  align-items: center;
  margin: 0 auto;
}

.social-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.social img {
  border-radius: 50%;
  object-fit: cover;
  margin-right: 2rem;
  height: 7rem;
  width: 7rem;
}

.social .meta {
  grid-column: 6 / 10;
}
</style>
