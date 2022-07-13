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

  const playModeText = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence ? 
      '顺序播放' : playModeVal === PLAY_MODE.loop ? '单曲循环' : '随机播放'
  })

  const changePlayMode = () => {
    const mode = (playMode.value + 1) % 3
    store.dispatch('changePlayMode', mode)
  }

  return {
    playMode, playModeText, playModeIcon, changePlayMode
  }
}