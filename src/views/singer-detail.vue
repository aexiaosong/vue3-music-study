<template>
  <div class="singer-detail">
    <music-list :title="title" :pic="pic" :songs="songs" :loading="loading"></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'singer-detail',
  props: {
    singer: Object
  },
  components: { MusicList },
  data() {
    return {
      songs: [],
      loading: true
    }
  },
  computed: {
    computedSinger() {
      const singer = this.singer
      if (singer) {
        return singer
      } else {
        const cacheSinger = storage.session.get(SINGER_KEY)
        if (cacheSinger && cacheSinger.mid === this.$route.params.id) {
          return cacheSinger
        }
      }
      return null
    },
    pic() {
      const computedSinger = this.computedSinger
      return computedSinger && computedSinger.pic
    },
    title() {
      const computedSinger = this.computedSinger
      return computedSinger && computedSinger.name
    }
  },
  async created() {
    if (!this.computedSinger) {
      const path = this.$route.matched[0].path
      console.log(path)
      this.$router.push({ path })
      return
    }
    const detail = await getSingerDetail(this.computedSinger)
    this.songs = await processSongs(detail.songs)
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: $color-background;
}
</style>
