import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    props: {
      data: Object
    },
    components: { MusicList },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      computedData() {
        const data = this.data
        if (data) {
          return data
        } else {
          const cache = storage.session.get(key)
          if (cache && cache.mid === this.$route.params.id) {
            return cache
          }
        }
        return null
      },
      pic() {
        const computedData = this.computedData
        return computedData && computedData.pic
      },
      title() {
        const computedData = this.computedData
        return computedData && (computedData.name || computedData.title)
      }
    },
    async created() {
      const data = this.computedData
      if (!data) {
        const path = this.$route.matched[0].path
        this.$router.push({ path })
        return
      }
      const detail = await fetch(data)
      this.songs = await processSongs(detail.songs)
      this.loading = false
    }
  }
}
