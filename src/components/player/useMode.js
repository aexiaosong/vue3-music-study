import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'

export default function useMode() {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  const playModeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence ? 
      'icon-sequence' : playModeVal === PLAY_MODE.loop ? 'icon-loop' : 'icon-random'
  })

  const changePlayMode = () => {
    const mode = (playMode.value + 1) % 3
    store.dispatch('changePlayMode', mode)
  }

  return {
    playModeIcon, changePlayMode
  }
}