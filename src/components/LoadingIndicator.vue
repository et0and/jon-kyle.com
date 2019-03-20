<template>
  <div class="LoadingIndicator">{{text}}</div>
</template>

<script>
export default {
  name: 'LoadingIndicator',
  data() {
    return {
      text: 'loading-',
      frame: '',
    }
  },
  mounted() {
    this.frame = setInterval(this.tick, 100)
  },
  destroyed() {
    clearInterval(this.frame)
  },
  methods: {
    tick() {
      this.text = (
        this.text.substring(1, this.text.length)
        + this.text.substring(0, 1)
      )
    },
  },
}
</script>

<style scoped>
div {
  font-family: var(--mono);
  flex: 1;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}
</style>
