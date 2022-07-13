import { h, mergeProps, withCtx, renderSlot, ref, computed, watch, nextTick } from 'vue'
import Scroll from '@/components/base/scroll/scroll'
import { useStore } from 'vuex'

// 基于Scroll组件的二次封装，加上一些业务逻辑（播放列表变化时重新计算滚动区域）
export default {
  name: 'wrap-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(
      Scroll,
      mergeProps({ ref: 'scrollRef' }, ctx.$props, { onScroll: (e) => ctx.$emit('scroll', e)}),
      { default: withCtx(() => [renderSlot(ctx.$slots, 'default')]) }
    )
  },
  setup() {
    const scrollRef = ref(null)
    const scroll = computed(() => scrollRef.value.scroll)

    const store = useStore()
    const playlist = computed(() => store.state.playlist)

    // 添加的核心业务代码，其他代码都是在实现原有组件的功能
    watch(playlist, async () => {
      await nextTick()
      scroll.value.refresh()
    })

    return { scrollRef, scroll }
  }
}