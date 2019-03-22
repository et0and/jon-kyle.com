<template>
  <header>
    <div class="title"><router-link to="/">Jon-Kyle</router-link></div>
    <div><router-link to="/about">About</router-link></div>
    <div>
      <router-link to="/">Feed</router-link><br>
      <router-link to="/index">Index</router-link>
    </div>
    <div>
      <form @submit="onSearchSubmit">
        <div>
          <input placeholder="Search" v-model="search" />
          <div class="filler">{{search.replace(/ /g, '&nbsp;') || 'Search'}}</div>
        </div>
      </form>
      <MailingList v-if="mailingListVisible" />
    </div>
    <div :class="['toggle-light', { night: isNight }]" @click="toggleLight">
      <svg width="100px" height="100px" viewBox="0 0 100 100">
          <g id="orb">
            <circle id="disc" fill="rgb(var(--fg))" cx="20" cy="20" r="20"></circle>
            <circle id="cut" fill="rgb(var(--bg))" cx="20" cy="20" r="20"></circle>
          </g>
          <path d="M51,21 L48,21 L48,4 L51,4 L51,21 Z M51.75,96 L48.75,96 L48.75,79 L51.75,79 L51.75,96 Z M4.5,51.5 L4.5,48.5 L21.5,48.5 L21.5,51.5 L4.5,51.5 Z M78.5,51.5 L78.5,48.5 L95.5,48.5 L95.5,51.5 L78.5,51.5 Z M17.0841793,19.0191036 L19.2054997,16.8977832 L31.226315,28.9185985 L29.1049946,31.0399189 L17.0841793,19.0191036 Z M69.4100811,71.3450054 L71.5314015,69.223685 L83.5522168,81.2445003 L81.4308964,83.3658207 L69.4100811,71.3450054 Z M18.5691036,83.3658207 L16.4477832,81.2445003 L28.4685985,69.223685 L30.5899189,71.3450054 L18.5691036,83.3658207 Z M70.8950054,31.0399189 L68.773685,28.9185985 L80.7945003,16.8977832 L82.9158207,19.0191036 L70.8950054,31.0399189 Z" id="rays" fill="rgb(var(--fg))"></path>
      </svg>
    </div>
  </header>
</template>

<script>
import MailingList from './MailingList'

export default {
  name: 'GlobalHeader',
  components: { MailingList },
  watch: {
    '$route.name': function (name) {
      if (name !== 'search') this.search = ''
      else return this.search = this.$route.query.query || ''
    },
  },
  data() {
    return {
      search: (this.$route.query.query || ''),
      email: '',
    }
  },
  computed: {
    mailingListVisible() {
      return true
      // return this.$store.state.options.subscribed === false
    },
    isNight() {
      return this.$store.state.options.night
    },
  },
  methods: {
    onSearchSubmit(event) {
      event.preventDefault()
      if (this.search && this.search.length >= 3) {
        this.$router.push({ path: '/search', query: { query: this.search } })
      } else {
        this.$router.push({ path: '/' })
      }
    },
    toggleLight() {
      this.$store.commit('setOptions', { night: !this.$store.state.options.night })
    },
  },
}
</script>

<style scoped>
header {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(12, 1fr);
  padding: 1rem 1rem 4rem 1rem;
  margin-top: -0.3rem;
}

a { text-decoration: none }
a:hover { text-decoration: underline }

header div:not(.title) a.router-link-exact-active {
  text-decoration: line-through;
}

header > div {
  grid-column: span 3;
}

.toggle-light {
  background: none;
  color: inherit;
  border: 0;
  font-size: 1rem;
  position: absolute;
  top: 0;
  line-height: 1;
  right: 0;
  padding: 0.75rem;
  outline: 0;
  cursor: pointer;
  user-select: none;
  -moz-user-select: none;
}

svg {
  height: 1.5rem;
  width: 1.5rem;
}

svg path {
  transform-origin: 50% 50%;
  transition: transform 150ms ease-out, opacity 150ms ease-out;
}

.toggle-light:not(.night) svg path {
  transition-delay: 125ms;
}

.toggle-light.night svg path {
  opacity: 0;
  transform: scale(0.8);
}

#orb {
  transform-origin: 50% 50%;
  transition: transform 150ms ease-out, opacity 150ms ease-out;
  transform: translate(30px, 30px);
}

#cut {
  transition: transform 150ms ease-out, opacity 150ms ease-out;
  transform-origin: 50% 50%;
  transform: translate(30px, -30px);
}

.toggle-light.night #cut {
  transform: translate(10px, -10px);
  transition-delay: 125ms;
}

.toggle-light.night #orb {
  transform: scale(1.3) translate(30px, 30px);
  transition-delay: 125ms;
}

form { display: flex; }
form > div { position: relative; }

.filler {
  position: relative;
  opacity: 0;
  pointer-events: none;
}

input {
  color: inherit;
  background: none;
  font-size: inherit;
  font-family: inherit;
  border: 0;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  outline: 0;
}

form span {
  color: rgba(var(--fg), 0.4);
}

form span.commaActive {
  color: rgba(var(--fg), 1);
}

</style>
