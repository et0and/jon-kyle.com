<template>
  <div v-if="view === 'loading'">
    Loading…
  </div>
  <div v-else-if="view === 'success'">Success!</div>
  <div v-else-if="view === 'error'">Error, try again</div>
  <form v-else class="mailinglist" @submit="onSubmit" ref="form" autocomplete="off">
    <div>
      <input
        id="field_0"
        name="embedded_form_subscription[field_0]"
        placeholder="Mailinglist"
        v-model="address"
        type="email"
        required
      >
      <span v-html="address || 'Mailinglist'"></span>
    </div>
    <input
      type="text"
      style="display: none"
      name="hpf54dd2b6-65b9-11e8-a3c9-06b79b628af2"
      tabindex="-1"
      aria-hidden="true"
      autocomplete="nope"
    >
    <button type="submit" v-if="address">→</button>
  </form>
</template>

<script>
import xhr from 'xhr'

export default {
  name: 'MailingList',
  data() {
    return {
      view: 'empty',
      address: '',
    }
  },
  methods: {
    onSubmit(event) {
      const form = this.$refs.form
      event.preventDefault()
      this.view = 'loading'

      xhr({
        method: 'post',
        body: new FormData(form),
        uri: 'https://emailoctopus.com/lists/f54dd2b6-65b9-11e8-a3c9-06b79b628af2/members/embedded/1.1/add',
      }, (err, resp, body) => {
        if (err || resp.statusCode !== 200) {
          this.view = 'error'
          setTimeout(() => (this.view = 'input'), 2000)
        } else {
          this.view = 'success'
          setTimeout(() => {
            this.$store.commit('setOptions', { subscribed: true })
          }, 2000)
        }
      })
    },
  },
}
</script>

<style scoped>
.mailinglist {
  display: flex;
  position: relative;
}

button {
  display: block;
  color: inherit;
  background: none;
  border: none;
  padding: 0 0.5rem;
  margin-top: -0.2em;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
}

span {
  pointer-events: none;
  white-space: nowrap;
  padding: 0 0.1rem;
  opacity: 0;
}

div {
  position: relative;
}

input {
  font-size: inherit;
  font-family: var(--sans);
  border: 0;
  color: inherit;
  background: none;
  outline: 0;
  width: 100%;
  padding: 0.1rem 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
