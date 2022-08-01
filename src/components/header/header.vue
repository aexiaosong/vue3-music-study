<template>
  <div class="header">
    <!-- <span class="icon"></span> -->
    <h1 class="text">Music</h1>
    <router-link class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>
<script>
export default {
  name: 'm-header'
}
</script>

<style lang="scss" scoped>
.header {
  height: 44px;
  text-align: center;
  color: $color-theme;
  .icon {
    display: inline-block;
    @include bg-image('logo');
    width: 30px;
    height: 32px;
    background-size: 30px 32px;
    margin-top: 6px;
    margin-right: 9px;
  }
  .text {
    display: inline-block;
    line-height: 44px;
    vertical-align: top;
    font-size: $font-size-large;
  }
  .mine {
    position: absolute;
    top: 0;
    right: 0;
    .icon-mine {
      display: block;
      padding: 12px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
}
</style>