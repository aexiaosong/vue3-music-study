import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default function useCd() {
  const cdRef = ref(null)
  const cdImgRef = ref(null)
  
  const store = useStore()
  const playing = computed(() => store.state.playing)
  const cdCls = computed(() => playing.value ? 'playing' : '')

  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImgRef.value)
    }
  })

  const syncTransform = (wrapper, inner) => {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    // getComputedStyle().transform计算出的旋转角度是相对父元素当前位置的，如果父元素已经转动过了需要叠加原来的角度
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
  }

  return { cdCls, cdRef, cdImgRef }
}
