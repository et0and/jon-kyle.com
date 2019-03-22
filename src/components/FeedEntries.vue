<template>
  <div class="container-feed">
    <div
      v-for="entry in visible"
      :key="entry.name"
    >
      <ContentEntry
        :entry="entry"
        :truncate="true"
      />
    </div>
    <paginate
      v-model="page"
      v-if="count > 1"
      :page-count="count"
      :click-handler="onPaginationClick"
      :page-range="range"
      :prev-text="'← Present'"
      :next-text="'Past →'"
      :prev-link-class="'icon-button-arrow left'"
      :next-link-class="'icon-button-arrow right'"
      :container-class="'pagination a-hover'"
    />
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate'
import ContentEntry from './ContentEntry'

export default {
  name: 'FeedEntries',
  components: { ContentEntry, Paginate },
  watch: {
    '$route.query.page': function (page) {
      this.page = parseInt(page) || 1
    },
  },
  props: {
    entries: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      page: parseInt(this.$route.query.page) || 1,
    }
  },
  computed: {
    range() {
      return this.$store.state.ui.range
    },
    count() {
      return Math.ceil(this.entries.length / this.range)
    },
    visible() {
      const page = this.page - 1
      return this.entries
        .slice((page * this.range), ((page * this.range) + this.range))
    },
  },
  methods: {
    onPaginationClick(page) {
      const newQuery = Object.assign({}, this.$route.query, { page })
      if (page === 1) delete newQuery.page
      this.$router.push({ path: this.$route.path, query: newQuery })
    },
  },
}
</script>

<style scoped>
.container-feed > div:not(:first-child) {
  margin-top: 5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  list-style: none;
  margin-top: 4.5rem;
}

.pagination >>> li.disabled a {
  color: rgba(var(--fg), 0.25);
  pointer-events: none;
}

.pagination >>> li.active a {
  color: rgba(var(--fg), 0.25);
}

.pagination >>> a {
  display: block;
  padding: 0.5rem;
  outline: 0;
}
</style>
