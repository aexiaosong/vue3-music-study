import { nextTick, reactive, ref, watch, computed } from 'vue'

export function useFixed(props) {
  const FIXED_TITLE_HEIGHT = 30
  const groupEl = ref(null)
  const listHeight = reactive([])
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const dy = ref(0)

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) return ''
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  const fixedStyle = computed(() => {
    const diff = (dy.value > 0 && dy.value < FIXED_TITLE_HEIGHT) ? dy.value - FIXED_TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0,${diff}px,0)`
    }
  })

  // 监测渲染数据变化，渲染后计算每块高度
  watch(() => props.data, async () => {
    await nextTick()
    calculate()
  })

  watch(scrollY, (newY) => {
    for (let i = 0; i < listHeight.length - 1; i++) {
      const heightTop = listHeight[i]
      const heightBottom = listHeight[i + 1]
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        dy.value = heightBottom - newY
      }
    }
  })

  function calculate() {
    const list = groupEl.value.children
    listHeight.length = 0
    let height = 0
    listHeight.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeight.push(height)
    }
  }

  function onScroll(pos) {
    scrollY.value = -pos.y
  }

  return { groupEl, onScroll, fixedTitle, fixedStyle, currentIndex }
}