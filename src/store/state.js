 import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY } from '@/assets/js/constant'
 import { load } from '@/assets/js/array-local-store'

 const state = {
  sequenceList: [], // 给用户展示的播放列表
  playlist: [], // 内部播放音乐的列表
  playing: false, // 音乐是否在播放
  playMode: PLAY_MODE.sequence, // 播放模式
  currentIndex: 0, // 当前播放的音乐在播放列表的索引
  fullScreen: false, // 是否切换到全屏播放器
  favoriteList: load(FAVORITE_KEY), // 歌曲收藏列表
  searchHistory: load(SEARCH_KEY), // 搜索记录
 }

 export default state
 