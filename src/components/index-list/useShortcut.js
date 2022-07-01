import { computed, ref } from 'vue'

export function useShortcut(props, groupEl) {
  const ANCHOR_HEIGHT = 18 // 锚点高度
  const scroll = ref(null)
  const shortcutList = computed(() => {
    return props.data.map((item) => item.title)
  })

  const touch = {}

  function onShortcutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.startY = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }
  
  function onShortcutTouchMove(e) {
    touch.moveY = e.touches[0].pageY
    const dIndex = (touch.moveY -touch.startY) / ANCHOR_HEIGHT | 0
    const anchorIndex = touch.anchorIndex + dIndex
    scrollTo(anchorIndex)
  }
  
  function scrollTo(index) {
    if(isNaN(index)) return
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupEl.value.children[index]
    scroll.value.scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    scroll,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}