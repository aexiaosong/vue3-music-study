 import { PLAY_MODE } from '@/assets/js/constant'

 const state = {
  sequenceList: [], // 给用户展示的播放列表
  playlist: [], // 内部播放音乐的列表
  playing: false, // 音乐是否在播放
  playMode: PLAY_MODE.sequence, // 播放模式
  currentIndex: 0, // 当前播放的音乐在播放列表的索引
  fullScreen: false // 是否切换到全屏播放器
 }

 export default state
 