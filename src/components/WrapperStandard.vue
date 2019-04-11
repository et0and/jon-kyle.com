<template>
  <main>
    <GlobalHeader />
    <div class="content">
      <slot />
    </div>
  </main>
</template>

<script>
import GlobalHeader from '@/components/GlobalHeader'

export default {
  name: 'WrapperStandard',
  components: { GlobalHeader }
}
</script>