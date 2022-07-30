<template>
  <div
    ref="rootRef" class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="singer in singers" :key="singer.id" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{singer.name}}</p>
        </div>
      </li>
      <li class="suggest-item" v-for="song in songs" :key="song.id" @click="selectSong(song)">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">
            {{`${song.singer}-${song.name}`}}
          </p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed, nextTick } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import usePullUpLoad from './usePullUpLoad'

export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-song', 'select-singer'],
  setup(props, { emit }) {
    const singers = ref([])
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('')
    const noResultText = ref('抱歉，暂无搜索结果')
    const manualLoading = ref(false)

    const loading = computed(() => !singers.value.length && !songs.value.length)
    const noResult = computed(() => !singers.value.length && !songs.value.length && !hasMore.value)
    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })
    const preventPullLoad = computed(() => loading.value || manualLoading.value)

    watch(() => props.query, (newQuery) => {
      if (!newQuery) return
      searchFirst()
    })

    const searchFirst = async () => {
      if (!props.query) return
      page.value = 1
      songs.value = []
      singers.value = []
      hasMore.value = true
      const result = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongs(result.songs)
      singers.value = result.singers
      hasMore.value = result.hasMore
      await nextTick()
      await maskItScrollable()
    }

    const searchMore = async () => {
      if (!hasMore.value || !props.query) return
      page.value++
      const result = await search(props.query, page.value, props.showSinger)
      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore
      await nextTick()
      await maskItScrollable()
    }

    const maskItScrollable = async () => {
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true
        await searchMore()
        manualLoading.value = false
      }
    }

    const selectSong = (song) => {
      emit('select-song', song)
    }

    const selectSinger = (singer) => {
      emit('select-singer', singer)
    }

    const { rootRef, isPullUpLoad, scroll } = usePullUpLoad(searchMore, preventPullLoad)

    return {
      singers, songs, loading, loadingText,
      noResultText, noResult,
      rootRef, pullUpLoading,
      selectSong, selectSinger
    }
  }
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
