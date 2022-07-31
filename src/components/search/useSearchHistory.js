import { save, remove, clear } from '@/assets/js/array-local-store'
import { SEARCH_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'

export default function useSearchHistory() {
  const maxLen = 20

  const store = useStore()

  const saveSearch = (query) => {
    const compare = (item) => item === query
    const searches = save(SEARCH_KEY, query, compare, maxLen)
    store.commit('setSearchHistory', searches)
  }

  const deleteSearch = (query) => {
    const searches = remove(SEARCH_KEY, (item) => item === query)
    store.commit('setSearchHistory', searches)
  }

  const clearSearch = () => {
    const searches = clear(SEARCH_KEY)
    store.commit('setSearchHistory', searches)
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch
  }
}
