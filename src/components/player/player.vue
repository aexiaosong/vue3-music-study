<template>
  <div class="player" v-show="playlist.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
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
        <div class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <div ref="cdWrapperRef" class="cd-wrapper">
              <div class="cd" ref="cdRef">
                <img ref="cdImgRef" class="image" :class="cdImgCls" :src="currentSong.pic" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" :style="middleRStyle" ref="lyricScrollRef">
            <div class="lyric-wrapper">
              <div ref="lyricListRef" v-if="currentLyric">
                <p
                  class="text"
                  :class="{'current': currentLineNum === index}"
                  v-for="(line, index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{line.txt}}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{pureMusicLyric}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentDotShow==='cd'}"></span>
            <span class="dot" :class="{'active': currentDotShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="progressBarRef"
                :progress="progress"
                @progressChanging="onProgressChanging"
                @progressChanged="onProgressChanged"
              >
              </progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
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
              <i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <mini-player :progress="progress" :toggle-play="togglePlay"></mini-player>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="audioReady"
      @error="audioError"
      @timeupdate="updateSongTime"
      @ended="audioEnd"
    />
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch, ref, nextTick } from 'vue'
import { formatTime } from '@/assets/js/utils'
import { PLAY_MODE } from '@/assets/js/constant'

import ProgressBar from './progress-bar'
import Scroll from '@/components/base/scroll/scroll'
import MiniPlayer from './mini-player'

import useMode from './useMode'
import useFavorite from './useFavorite'
import useCd from './useCd'
import useLyric from './useLyric'
import useMiddleInteractive from './useMiddleInteractive'
import useAnimation from './useAnimation'
import usePlayHistory from './usePlayHistory'


export default {
  name: 'player',
  components: { ProgressBar, Scroll, MiniPlayer },
  setup() {
    const audioRef = ref(null)
    const progressBarRef = ref(null)
    
    // 播放器是否准备好
    const songReady = ref(false)
    const currentTime = ref(0)
    let progressChanging = false

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
    
    const progress = computed(() => currentTime.value / currentSong.value.duration)

    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) return
      currentTime.value = 0
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      songReady.value = false
      audioEl.play()
      store.commit('setPlayingState', true)
    })

    // 监听播放器状态，根据状态让播放器播放或暂停
    watch(playing, (newPlaying) => {
      if (!songReady.value) return
      const audioEl = audioRef.value
      if (newPlaying) {
        audioEl.play()
        playLyric()
      } else {
        audioEl.pause()
        stopLyric()
      }
    })

    watch(fullScreen, async (newFullScreen) => {
      if (newFullScreen) {
        await nextTick()
        progressBarRef.value.setOffset(progress.value)
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
      }
    }

    // 重置当前歌曲进度，实现循环播放同一首歌
    const replay = () => {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
      store.commit('setPlayingState', true)
    }

    // 播放器缓冲成功的回调
    const audioReady = () => {
      if (songReady.value) return
      songReady.value = true
      playLyric()
      savePlay(currentSong.value)
    }

    // 播放器缓冲失败的回调
    const audioError = () => {
      songReady.value = true
    }

    // 播放器进度更新回调
    const updateSongTime = (e) => {
      if (!progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }

    // 进度条拖动回调
    const onProgressChanging = (progress) => {
      progressChanging = true
      currentTime.value = progress * currentSong.value.duration
      playLyric() // 修改了currentTime需要让歌词同步到当前文章
      stopLyric() // 进度条拖动的途中把歌词停下来
    }

    // 进度条拖动结束回调
    const onProgressChanged = (progress) => {
      audioRef.value.currentTime = currentTime.value = progress * currentSong.value.duration
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
      progressChanging = false
      playLyric() // 松开进度条后播放歌词
    }

    // 歌曲播放结束回调
    const audioEnd = () => {
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.loop) {
        replay()
      } else {
        next()
      }
    }

    // 播放模式hook
    const { playMode, playModeIcon, changePlayMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { cdImgCls, cdRef, cdImgRef } = useCd()
    const {
      currentLyric,
      currentLineNum,
      playLyric, stopLyric,
      lyricScrollRef, lyricListRef,
      pureMusicLyric, playingLyric
    } = useLyric({ songReady, currentTime })
    const {
      middleLStyle, middleRStyle,
      currentDotShow,
      onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd
    } = useMiddleInteractive()
    const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation()
    const { savePlay } = usePlayHistory()

    return {
      fullScreen, currentSong, audioRef, playIcon, disableCls, playlist,
      exitFullScreen, togglePlay, pause, prev, next, audioReady, audioError, audioEnd,
      playModeIcon, changePlayMode,
      getFavoriteIcon, toggleFavorite,
      currentTime, progress, updateSongTime, formatTime, onProgressChanging, onProgressChanged, progressBarRef,
      cdImgCls, cdRef, cdImgRef,
      currentLyric, currentLineNum, lyricScrollRef, lyricListRef, pureMusicLyric, playingLyric,
      middleLStyle, middleRStyle, currentDotShow, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd,
      cdWrapperRef, enter, afterEnter, leave, afterLeave
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
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          height: 100%;
          width: 80%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
              box-sizing: border-box;
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
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
    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.6s;
      .top, .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from, &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
