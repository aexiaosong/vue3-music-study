import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from '@/assets/js/lyric-parse'

export default function useLyric({ songReady, currentTime }) {
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)

  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', { song: newSong, lyric })

    if (currentSong.value.lyric !== lyric) {
      return
    }
    currentLyric.value = new Lyric(lyric, handleLyric)
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  const handleLyric = ({ lineNum, txt }) => {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  const playLyric = () => {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  const stopLyric = () => {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop(currentTime.value * 1000)
    }
  }

  return {
    lyricScrollRef,
    lyricListRef,
    currentLyric,
    currentLineNum,
    playLyric,
    stopLyric,
    pureMusicLyric,
    playingLyric
  }
}
