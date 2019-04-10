<template>
  <div class="container">
    <div class="map-container">
      <div class="map">
        <div class="map-header">
          <h2>{{page.title}}</h2>
          <div class="sort" @click="sortDesc = !sortDesc">Sort ↑↓</div>
          <div v-if="page.live === false">(Live-ish)</div>
        </div>
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
          <l-circle-marker :lat-lng="start" :fill="false" :radius="6" color="rgb(var(--bg))" />
          <l-circle-marker :lat-lng="finish" :fill="false" :radius="6" color="rgb(var(--bg))" />
          <l-circle-marker
            v-for="entry in entriesSorted"
            :lat-lng="[entry.lat, entry.lng]"
            :fill="false"
            :radius="6"
            :color="entry.day === entries.length ? 'red' : 'rgb(var(--fg))'"
            @click="focus(entry, 'entry')"
           />
        </l-map> 
        <div class="meta">
          <ul>
            <li>
              <div>Distance</div><div class="mono">{{page.mile}}/{{page.miles}}mi</div>
            </li>
            <li>
              <div>Days</div><div class="mono">{{entries.length}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="walk-content">
      <ContentWalk
        v-for="entry in entriesSorted"
        :id="'entry-' + entry.name"
        :truncate="true"
        :key="entry.name"
        :entry="entry"
        :color="entry.day === entries.length ? 'red' : 'rgb(var(--fg))'"
        :onPermalink="focus"
      />
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LCircleMarker } from 'vue2-leaflet'
import ContentWalk from './ContentWalk'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'FeedWalk',
  components: { ContentWalk, LMap, LTileLayer, LCircleMarker },
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
      url: 'https://caltopo.com/tile/r/{z}/{x}/{y}@2x.png',
      start: [32.60509, -116.46163],
      finish: [49.06465, -120.78158],
      options: {

      }
    }
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
    }
  },
  methods: {
    zoomUpdate (zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate (center) {
      this.currentCenter = center;
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
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 1rem;
  padding: 0 1rem;
  flex: 1;
}

.walk-content {
  grid-column: span 6;
  padding-bottom: 1rem;
}

.map-container {
  grid-column: span 6;
  position: relative;
  padding: 1rem 0;
}

.map-header {
  display: flex;
  justify-content: space-between;
  padding: 0 0 1rem;
}

.container .sort {
  cursor: pointer;
}

.container .sort:hover {
  text-decoration: underline;
}

.map {
  position: sticky;
  top: 1rem;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 2rem);
}

.container .meta {
  padding-top: 1rem;
}

.container .meta li {
  list-style: none;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(var(--fg), 0.25);
}

.container .meta li:first-child {
  padding-top: 0;
}

.container .meta li:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.container >>> .leaflet-bottom.leaflet-right {
  display: none !important;
}

.container >>> .copy {
  --col: 1 / 12;
}

.container .walk-content > div {
  padding-top: 1rem;
}

.container .walk-content > div:not(:first-child) {
  margin-top: 4rem;
}

.container >>> .vue2leaflet-map {
  height: auto;
  flex: 1;
}

.container >>> .leaflet-control-layers,
.container >>> .leaflet-bar {
  border: 0 !important;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}

.container >>> .leaflet-top .leaflet-control {
  margin-top: 1rem;
}

.container >>> .leaflet-left {
  right: 0;
  margin-right: 1rem;
  left: auto;
}

.container >>> .leaflet-interactive[stroke="rgb(var(--bg))"] {
  fill: rgb(var(--bg));
}

.container >>> .leaflet-interactive[stroke="rgb(var(--fg))"] {
  fill: rgba(var(--fg), 0);
}

.container >>> .leaflet-interactive[stroke="red"] {
  fill: rgba(0, 0, 0, 0);
}

@media (max-width: 800px) {
  .walk-content, .map-container {
    grid-column: span 13;
  }

  .map-container { grid-row: 1 }
  .walk-content { grid-row: 2 }

  .map { height: 50vh }

  .walk-content > div {
    margin-top: 4rem;
  }
}
</style>