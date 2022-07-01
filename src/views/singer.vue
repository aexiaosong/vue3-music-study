<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" />
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
      singers: []
    }
  },
  async created() {
    const data = await getSingerList()
    this.singers = data.singers
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
