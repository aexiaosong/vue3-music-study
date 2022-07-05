<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" />
      </div>
      <div class="top">
        <div class="back" @click="exitFullScreen">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{currentSong.name}}</h1>
        <h2 class="subtitle">{{currentSong.singer}}</h2>
      </div>
      <div class="bottom">
        <div class="operators">
          <div class="icon i-left">
            <i @click="changePlayMode" :class="playModeIcon"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <i @click="togglePlay" :class="playIcon"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i @click="next" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="audioReady"
      @error="audioError"
    />
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import useMode from './useMode'

export default {
  name: 'player',
  setup() {
    const audioRef = ref(null)
    // 播放器是否准备好
    const songReady = ref(false)

    const store = useStore()
    const { state, getters } = store
    const fullScreen = computed(() => state.fullScreen)
    const currentSong = computed(() => getters.currentSong)
    const playing = computed(() => state.playing)
    const currentIndex = computed(() => state.currentIndex)
    const playlist = computed(() => state.playlist)

    // 播放键图标
    const playIcon  = computed(() => playing.value ? 'icon-pause' : 'icon-play')
    // 操作按钮样式
    const disableCls = computed(() => songReady.value ? '' : 'disable')

    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) return
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      songReady.value = false
      audioEl.play()
    })

    // 监听播放器状态，根据状态让播放器播放或暂停
    watch(playing, (newPlaying) => {
      if (!songReady.value) return
      const audioEl = audioRef.value
      if (newPlaying) {
        audioEl.play()
      } else {
        audioEl.pause()
      }
    })

    // 退出全屏
    const exitFullScreen = () => {
      store.commit('setFullScreen', false)
    }

    // 播放键切换
    const togglePlay = () => {
      if (!songReady.value) return
      store.commit('setPlayingState', !playing.value)
    }

    // 兼容非用户触发的暂停，为了修改播放图标样式
    const pause = () => {
      store.commit('setPlayingState', false)
    }

    // 点击上一曲
    const prev = () => {
      const list = playlist.value
      if (!songReady.value || !list.length) return
      if (list.length === 1) {
        replay()
      } else {
        let index = currentIndex.value - 1
        if (index === -1) {
          index = list.length - 1
        }
        store.commit('setCurrentIndex', index)
        if (!playing.value) { // 播放状态下会自动播放，加个判断提升性能
          store.commit('setPlayingState', true)
        }
      }
    }

    // 点击下一曲
    const next = () => {
      const list = playlist.value
      if (!songReady.value || !list.length) return
      if (list.length === 1) {
        replay()
      } else {
        let index = currentIndex.value + 1
        if (index === list.length) {
          index = 0
        }
        store.commit('setCurrentIndex', index)
        if (!playing.value) { // 播放状态下会自动播放，加个判断提升性能
          store.commit('setPlayingState', true)
        }
      }
    }

    // 重置当前歌曲进度，实现循环播放同一首歌
    const replay = () => {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
    }

    // 播放器缓冲成功的回调
    const audioReady = () => {
      if (songReady.value) return
      songReady.value = true
    }

    // 播放器缓冲失败的回调
    const audioError = () => {
      songReady.value = true
    }

    // 播放模式hook
    const { playModeIcon, changePlayMode } = useMode()

    return {
      fullScreen, currentSong, audioRef, playIcon, disableCls,
      exitFullScreen, togglePlay, pause, prev, next, audioReady, audioError,
      playModeIcon, changePlayMode
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap;
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
}
</style>
