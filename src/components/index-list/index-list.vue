<template>
  <Scroll class="index-list" :probeType="2" @scroll="onScroll" ref="scroll">
    <ul ref="groupEl" class="group-wrapper">
      <li v-for="group in data" :key="group.title" class="group">
        <h2 class="title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.list" :key="item.id" class="item">
            <img class="avatar" v-lazy="item.pic" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed" :style="fixedStyle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div style="position:fixed;top:100px;left:50px">{{currentIndex}}</div>
    <ul class="shortcut" @touchstart="onShortcutTouchStart" @touchmove="onShortcutTouchMove">
      <li
        v-for="(item, index) in shortcutList"
        :key="index"
        class="item"
        :class="{'current': currentIndex===index}"
        :data-index="index"
      >
        {{item}}
      </li>
    </ul>
  </Scroll>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import { useFixed } from './useFixed'
import { useShortcut } from './useShortcut'

export default {
  name: 'index-list',
  components: { Scroll },
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  },
  setup(props) {
    const { groupEl, onScroll, fixedTitle, fixedStyle, currentIndex } = useFixed(props)
    const { 
      shortcutList,
      scroll,
      onShortcutTouchStart,
      onShortcutTouchMove
    } = useShortcut(props, groupEl)
    return {
      groupEl, onScroll, fixedTitle, fixedStyle, currentIndex,
      shortcutList, scroll, onShortcutTouchStart, onShortcutTouchMove
    }
  }
}
</script>

<style lang="scss" scoped>
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: $color-background;
  .group-wrapper > .group {
    padding-bottom: 30px;
    .title {
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background-color: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
  .shortcut {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }
}
</style>
