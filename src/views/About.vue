<template>
  <div class="about" v-if="content">
    <section v-for="section in content" v-html="section"></section>
  </div>
  <LoadingIndicator v-else />
</template>

<script>
import LoadingIndicator from '@/components/LoadingIndicator'
import markdownIt from 'markdown-it'
import { mixin } from '../store'

const md = new markdownIt()

export default {
  name: 'About',
  mixins: [mixin],
  components: { LoadingIndicator },
  metaInfo() {
    return { title: 'About' }
  },
  computed: {
    content() {
      if (typeof this.page !== 'object' || !this.page.content) return
      const { location, branch } = this.$store.state.api
      return this.page.content
        .replace('jon-kyle.jpg', `${location + branch}/jon-kyle.jpg`)
        .split('---')
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
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 1rem;
}

section {
  grid-column: span 4;
}

@media (max-width: 750px) {
  section { grid-column: span 6 }
  section:first-child { grid-column: 1 / -1 }
}

@media (max-width: 600px) {
  section { grid-column: 1 / -1 }
}

section >>> img {
  display: block;
  margin: 0 26% 0 0;
  width: 74%;
}

section > >>> * + * {
  margin-top: 1rem;
}

section >>> ul { list-style: none }
section >>> li {
  text-indent: -1rem;
  padding-left: 1rem;
}
</style>
