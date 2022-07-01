<template>
  <div ref="scrollEl">
    <slot></slot>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useScroll } from './useScroll'
export default {
  name: 'scroll',
  props: {
    click: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const scrollEl = ref(null)
    useScroll(scrollEl, props)
    return { scrollEl }
  }
}
</script>

<style lang="scss" scoped>

</style>
