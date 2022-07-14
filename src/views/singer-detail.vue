<template>
  <div class="singer-detail">
    <music-list :title="title" :pic="pic" :songs="songs" :loading="loading"></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import createDetailComponent from '@/assets/js/createDetailComponent'
import { SINGER_KEY } from '@/assets/js/constant'

export default createDetailComponent('singer-detail', SINGER_KEY, getSingerDetail)
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
