<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" @select="selectSinger" />
    <router-view :singer="selectedSinger"></router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/index-list/index-list'

export default {
  name: 'singer',
  components: { IndexList },
  data() {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  async created() {
    const data = await getSingerList()
    this.singers = data.singers
  },
  methods: {
    selectSinger(singer) {
      this.selectedSinger = singer
      this.$router.push({ path: `/singer/${singer.mid}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0px;
  width: 100%;
}
</style>
