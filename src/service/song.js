import { get, flag } from './base'
import {
  processSongs as processSongsV2,
  getLyric as getLyricV2
} from '@/api/song'

export function processSongs(songs) {
  if (flag) return processSongsV2(songs)
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return get('/api/getSongsUrl', {
    mid: songs.map(song => song.mid)
  }).then(res => {
    const map = res.map
    return songs.map(song => {
      song.url = map[song.mid]
      return song
    }).filter(song => !!~song.url.indexOf('vkey'))
  })
}

const lyricMap = {}

export function getLyric(song) {
  if (flag) return getLyricV2(song)
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }
  return get('/api/getLyric', {
    mid
  }).then((res) => {
    const lyric = res ? res.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}