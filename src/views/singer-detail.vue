<template>
  <div class="singer-detail">
    <music-list :title="title" :pic="pic" :songs="songs" :loading="loading"></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/music-list/music-list'

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
    pic() {
      return this.singer && this.singer.pic
    },
    title() {
      return this.singer && this.singer.name
    }
  },
  async created() {
    let detail = await getSingerDetail(this.singer)
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
