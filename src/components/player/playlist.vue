<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playlist" v-show="visible && playlist.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="playModeIcon" @click="changePlayMode"></i>
              <span class="text">{{playModeText}}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <scroll ref="scrollRef" class="list-content">
            <transition-group ref="listRef" name="list" tag="ul">
              <li class="item" v-for="song in sequenceList" :key="song.id" @click="selectItem(song)">
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{song.name}}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span class="delete" :class="{disable: moving}" @click.stop="removeSong(song)">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>
        <confirm
          ref="confirmRef"
          text="是否清空播放列表"
          confirm-btn-text="清空"
          @confirm="confirmClear"
        />
      </div>
    </transition>
  </teleport>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref, nextTick, watch } from 'vue'
import Scroll from '@/components/base/scroll/scroll'
import Confirm from '@/components/base/confirm/confirm'
import useMode from './useMode'
import useFavorite from './useFavorite'

export default {
  name: 'playlist',
  components: { Scroll, Confirm },
  setup() {
    const scrollRef = ref(null)
    const listRef = ref(null)
    const confirmRef = ref(null)
    const visible = ref(false)
    const moving = ref(false)

    const store = useStore()
    const playlist = computed(() => store.state.playlist)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)

    watch(currentSong, async (newSong) => {
      if (visible.value && newSong.id) {
        await nextTick()
        scrollToCurrent()
      }
    })

    const hide = () => {
      visible.value = false
    }
    const show = async () => {
      visible.value = true
      await nextTick()
      refreshScroll()
      scrollToCurrent()
    }

    const getCurrentIcon = (song) => {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }

    const refreshScroll = () => {
      scrollRef.value.scroll.refresh()
    }

    const scrollToCurrent = () => {
      const index = sequenceList.value.findIndex((song) => currentSong.value.id === song.id)
      if (-1 === index) return
      scrollRef.value.scroll.scrollToElement(listRef.value.$el.children[index], 300)
    }

    const selectItem = (item) => {
      const index = playlist.value.findIndex((song) => song.id === item.id)
      store.commit('setCurrentIndex', index)
    }

    const removeSong = (song) => {
      if (moving.value) return
      moving.value = true
      store.dispatch('removeSong', song)
      if (!playlist.value.length) hide()
      setTimeout(() => moving.value = false, 300)
    }

    const showConfirm = () => {
      confirmRef.value.show()
    }

    const confirmClear = () => {
      store.dispatch('clearSongList')
      hide()
    }

    const { playModeText, playModeIcon, changePlayMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    return {
      visible, playlist, sequenceList,
      playModeText, playModeIcon, changePlayMode,
      getFavoriteIcon, toggleFavorite,
      hide, show, getCurrentIcon,
      scrollRef, listRef,
      selectItem, removeSong,
      moving,
      showConfirm, confirmRef, confirmClear
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrappper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from, &.list-fade-leave-to {
    opacity: 0;
    .list-wrappper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-text-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
