import { useStore } from 'vuex'
import { PLAY_KEY } from '@/assets/js/constant'
import { save } from '@/assets/js/array-local-store'

export default function usePlayHistory() {
  const store = useStore()

  const maxLen = 200

  const savePlay = (song) => {
    const songs = save(PLAY_KEY, song, (item) => item.id === song.id, maxLen)
    store.commit('setPlayHistory', songs)
  }

  return { savePlay }
}
