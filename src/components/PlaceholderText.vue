<template>
  <div>
    <p v-for="line in lines"><span v-for="word in line" v-html="word"></span></p>
  </div>
</template>

<script>
export default {
  name: 'PlaceholderText',
  data() {
    return { lines: [] }
  },
  mounted() {
    const lines = Math.floor(Math.random() * 2) + 1
    for (let l = 0; l < lines; l++) {
      const words = Math.floor(Math.random() * 5) + 10
      const line = []
      for (let i = 0; i < words; i++) {
        const letters = Math.floor(Math.random() * 10) + 1
        line.push(Array(letters).fill('█').join(''))
      }
      this.lines.push(line)
    }
  },
}
</script>

<style scoped>
p {
  color: rgba(var(--fg), 0.1);
}

span { margin-right: 1ch; display: inline-block; }
</style>
