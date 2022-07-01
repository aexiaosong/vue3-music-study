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
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  emits: ['scroll'],
  setup(props, { emit }) {
    const scrollEl = ref(null)
    const { scroll } = useScroll(scrollEl, props, emit)
    return { scrollEl, scroll }
  }
}
</script>

<style lang="scss" scoped>

</style>
