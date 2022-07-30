import { get } from './base'
import { reactive } from 'vue'

const topListCache = {}

export async function getTopList() {
  const { list } = await get('/toplist/detail')
  const topList = list.map(item => {
    const top =  {
      id: item.id,
      mid: item.id,
      name: item.name,
      pic: item.coverImgUrl,
      // songList: item.tracks.map(song => ({
      //   id: Math.random().toString(36).substring(2, 7), // 这个id仅作为虚拟dom的key
      //   singerName: song.second,
      //   songName: song.first
      // }))
    }
    top.songList = reactive([])
    get('/playlist/detail', { id: item.id }).then(res => {
      const songList = res.playlist.tracks.map(song => {
        return {
          id: song.id,
          mid: song.id,
          album: song.al.name,
          name: song.name,
          pic: song.al.picUrl,
          singer: song.ar.map(s => s.name).join('/'),
          url: '',
          songName: song.name,
          singerName: song.ar.map(s => s.name).join('/')
        }
      })
      top.songList.push(songList[0], songList[1], songList[2])
      topListCache[item.id] = songList
    })
    return top
  })
  return { topList }
}

export function getTopDetail(top) {
  if (topListCache[top.id]) {
    console.log('get cache')
    return { songs: topListCache[top.id] }
  }
  return get('/playlist/detail', { id: top.id }).then(res => {
    let songs = res.playlist.tracks
    songs = songs.filter(song => song.fee !== 1)
    songs = songs.map(song => {
      return {
        id: song.id,
        mid: song.id,
        album: song.al.name,
        name: song.name,
        pic: song.al.picUrl,
        singer: song.ar.map(s => s.name).join('/'),
        url: ''
      }
    })
    return { songs }
  })
}
