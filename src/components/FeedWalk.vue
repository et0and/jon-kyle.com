<template>
  <div class="walk-container">
    <GlobalHeader />
    <div class="map-header">
      <div>
        <div class="map-title">
          <h2>{{page.title}}</h2>
          <span class="mono">{{page.mile}}/{{page.total}}mi</span>
          <svg preserveAspectRatio="none" viewBox="0 0 10 10">
            <g stroke-width="1" stroke="rgb(var(--fg))" fill="none" fill-rule="evenodd" vector-effect="non-scaling-stroke">
              <circle id="Oval" cx="5" cy="5" r="4.5" vector-effect="non-scaling-stroke"></circle>
            </g>
          </svg> 
        </div>
        <router-link to="/entries/2019-04-19-pct">Introduction</router-link>, <span class="sort" @click="sortDesc = !sortDesc">Sort ↑↓</span>
      </div>
    </div>
    <div class="walk-map">
      <l-map
        ref="map"
        :center="center"
        :bounds="bounds"
        :max-bounds="maxBounds"
        :zoom="zoom"
        :min-zoom="4"
        :options="options"
        @update:center="centerUpdate"
        @update:zoom="zoomUpdate"
      >
        <l-tile-layer :url="url" /> 
        <l-geo-json
          v-if="geojson"
          :geojson="geojson"
          :options-style="styleFunction"
        />
        <l-circle-marker v-if="false" :lat-lng="start" :fill="false" :radius="6" color="rgb(var(--bg))" />
        <l-circle-marker v-if="false" :lat-lng="finish" :fill="false" :radius="6" color="rgb(var(--bg))" />
        <l-circle-marker
          v-for="entry in entriesSorted"
          :lat-lng="[entry.lat, entry.lng]"
          :fill="false"
          :radius="6"
          :color="entry.day === entries.length ? 'rgba(var(--fg), 1)' : 'rgb(var(--fg))'"
          @click="focus(entry, 'entry')"
          />
      </l-map> 
    </div>
    <div class="walk-content" v-if="entriesSorted && entriesSorted.length">
      <div v-for="(entry, i) in entriesSorted">
        <ContentWalk
          :id="'entry-' + entry.name"
          :truncate="true"
          :key="entry.name"
          :entry="entry"
          :active="entry.day === entries.length"
          :onPermalink="focus"
        />
        <div v-if="i === 0" :class="['note', { active: noteState === 'pitch' }]" @click="noteState = 'how'">
          <div class="note-icon">{{note[noteState].icon}}</div>
          <div class="note-text">{{note[noteState].text}}</div>
        </div>
      </div>
    </div>
    <div class="walk-no-content" v-else>
      There aren’t any entires yet, but check back soon
    </div>
  </div>
</template>

<script>
import { LMap, LGeoJson, LTileLayer, LCircleMarker } from 'vue2-leaflet'
import GlobalHeader from './GlobalHeader'
import ContentWalk from './ContentWalk'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'FeedWalk',
  components: { GlobalHeader, ContentWalk, LMap, LGeoJson, LTileLayer, LCircleMarker },
  props: {
    page: {
      type: Object,
      default: { }
    },
    entries: {
      type: Array,
      default: [ ]
    }
  },
  data () {
    return {
      sortDesc: true,
      bounds: L.latLngBounds([[32.60509, -116.46163], [49.06465, -120.78158]]),
      maxBounds: L.latLngBounds([[32.60509, -116.46163], [49.06465, -120.78158]]).pad(1),
      center: [0, 0],
      currentCenter: [0, 0],
      zoom: 13,
      geojson: null,
      url: 'https://caltopo.com/tile/satday_v-99999/{z}/{x}/{y}.png',
      urlShade: 'https://caltopo.com/tile/r/{z}/{x}/{y}@2x.png',
      urlLive: 'https://caltopo.com/tile/satday_v-99999/{z}/{x}/{y}.png',
      start: [32.60509, -116.46163],
      finish: [49.06465, -120.78158],
      noteState: 'pitch',
      note: {
        pitch: { icon: '🍻', text: 'Amused? Bewildered? Buy me a drink or coffee for when I’m in town and leave a note!' },
        how: { icon: '👍', text: 'Oh thanks! You can do that using Venmo (jondashkyle) or Square ($jondashkyle)' }
      },
      options: {

      }
    }
  },
  created () {
    const url = 'https://raw.githubusercontent.com/jondashkyle/archive/master/entries/2019-04-19-pct/pct.json'
    fetch(url)
      .then(data => data.json())
      .then(data => (this.geojson = data))
      .catch()
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.map.mapObject.scrollWheelZoom.disable()
    })
  },
  computed: {
    entriesSorted () {
      return this.entries
        .sort((b, a) => (b.date.replace(/-/g, '') - a.date.replace(/-/g, '')))
        .map((entry, i) => Object.assign(entry, { day: i + 1 }))
        .sort((a, b) => {
          const next = b.date.replace(/-/g, '')  
          const prev = a.date.replace(/-/g, '')
          return this.sortDesc ? next - prev : prev - next
        })
    },
    entriesFeed () {
      return this.entriesSorted
    },
    styleFunction () {
      return () => {
        return {
          weight: 2,
          color: 'rgb(var(--bg))',
          opacity: 1,
          fillColor: 'rgb(var(--bg))',
          fillOpacity: 1
        };
      };
    },
  },
  methods: {
    zoomUpdate (zoom) {
      this.currentZoom = zoom
      this.url = zoom < 10 ? this.urlLive : this.urlShade
    },
    centerUpdate (center) {
      this.currentCenter = center
    },
    focus (event, target) {
      if (event.lat && event.lng) {
        const latlng = new L.LatLng(event.lat, event.lng)
        if (target === 'map') {
          if (window.innerWidth < 800) {
            const el = document.querySelector('.map-container')
            window.scrollTo(0, el.offsetTop)
          }
        } else {
          const el = document.querySelector('#entry-' + event.name)
          window.scrollTo(0, el.offsetTop)
        }
        this.$refs.map.mapObject.setView(latlng, 10)
      }
    }
  }
}
</script>

<style scoped>
.walk-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-left: 50%;
  width: 50%;
}

.walk-content {
  padding: 0 1rem 4rem;
}

.walk-no-content {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1rem 4rem;
  flex: 1;
}

.walk-map {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 50%;
}

.map-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0 3rem;
  text-align: center;
}

.map-title {
  position: relative;
  margin-bottom: 2rem;
}

.map-title svg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: -1.5rem -3rem;
  height: calc(100% + 3rem);
  width: calc(100% + 6rem);
}

.note {
  display: flex;
  border: 1px solid rgb(var(--fg));
  padding: 1rem;
  max-width: 25rem;
  margin: 4rem auto 0;
}

.note.active {
  cursor: pointer;
}

.note-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  font-size: 2rem;
  margin-right: 1rem;
}

.walk-container .sort {
  cursor: pointer;
}

.walk-container .sort:hover {
  text-decoration: underline;
}

.walk-content >>> .leaflet-bottom.leaflet-right {
  display: none !important;
}

.walk-container >>> .leaflet-control-zoom-in,
.walk-container >>> .leaflet-control-zoom-out {
  font-family: var(--mono);
  font-weight: normal;
  font-size: 1rem;
  color: rgb(var(--fg));
  background: rgb(var(--bg));
}

.walk-container >>> .leaflet-control-zoom-out {
  margin-top: 1px;
}

.walk-content > div {
  padding-top: 1rem;
}

.walk-content > div:not(:first-child) {
  margin-top: 4rem;
}

.walk-container >>> .leaflet-control-layers,
.walk-container >>> .leaflet-bar {
  border: 0 !important;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}

.walk-container >>> .leaflet-top .leaflet-control {
  margin-top: 1rem;
}

.walk-container >>> .leaflet-left {
  right: 0;
  margin-right: 1rem;
  left: auto;
}

.walk-container >>> .leaflet-interactive[stroke-width="3"][stroke="rgba(var(--fg), 1)"] {
  fill: rgb(var(--fg));
  stroke-width: 1px;
}


.walk-container >>> .leaflet-interactive[stroke-width="3"][stroke="rgb(var(--bg))"] {
  fill: rgba(var(--bg), 1);
  stroke-width: 1px;
}

.walk-container >>> .leaflet-interactive[stroke="rgb(var(--fg))"] {
  fill: rgba(0, 0, 0, 0);
  stroke-width: 1px;
}

.walk-container >>> .leaflet-interactive[stroke-width="2"][stroke="rgb(var(--bg))"] {
  stroke-dasharray: 5;
  stroke-dashoffset: 1;
  stroke-width: 1px;
  stroke: red;
}

.walk-container >>> .leaflet-bar a, .leaflet-bar a:hover {
  border-bottom: none;
}

.walk-container >>> .leaflet-tile-pane {
  filter: grayscale(1);
}

.walk-container >>> .leaflet-control-attribution {
  display: none;
}

@media (min-width: 800px) {
  .walk-content >>> .copy figure { grid-column: 3 / 11 }
  .walk-content >>> .copy { --col: 4 / 10 }
}

@media (max-width: 1600px) and (min-width: 800px) {
  .walk-content >>> .copy figure { grid-column: 2 / 12 }
  .walk-content >>> .copy { --col: 3 / 11 }
}

@media (max-width: 1200px) and (min-width: 800px) {
  .walk-content >>> .copy figure { grid-column: 1 / 13 }
  .walk-content >>> .copy { --col: 2 / 12 }
}

@media (max-width: 1000px) and (min-width: 800px) {
  .walk-content >>> .copy { --col: 1 / 13 }
}

@media (max-width: 800px) {
  .walk-container {
    margin-left: 0;
    width: auto;
  }

  .walk-map {
    position: relative;;
    height: 50vh;
    width: auto;
    margin-bottom: 3rem;
    z-index: 1;
  }
}
</style>