<template>
  <div class="album">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    />
  </div>
</template>

<script>
import createDetailComponent from '@/assets/js/createDetailComponent'
import { ALBUM_KEY } from '@/assets/js/constant'
import { getAlbum } from '@/service/recommend'

export default createDetailComponent('album', ALBUM_KEY, getAlbum)
</script>

<style lang="scss" scoped>
.album {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
  background: $color-background;
}
</style>
