import { get } from './base'

export async function processSongs(songs) {
  if (!songs.length) {
    return songs
  }
  const flag = true
  const ids = songs.map(s => s.id).join(',')
  songs = await get('/song/detail', { ids }).then(res => {
    const dtMap = res.songs.reduce((pre, cur) => {
      pre[cur.id] = { duration: cur.dt, pic: cur.al.picUrl + '?param=600y600' }
      return pre
    }, {})
    return songs.map(s => {
      s.duration = dtMap[s.id].duration / 1000 | 0
      s.pic = dtMap[s.id].pic
      return s
    })
  })
  if (flag) {
    return songs.map(s => ({
      ...s,
      url: `https://music.163.com/song/media/outer/url?id=${s.id}.mp3`
    }))
  } else {
    return get('/song/url', { id: ids }).then(res => {
      const map = res.data.reduce((pre, cur) => {
        pre[cur.id] = cur.url
        return pre
      }, {})
      return songs.map(s => ({
        ...s,
        url: map[s.id]
      }))
    })
  }
}

const lyricMap = {}

export function getLyric(song) {
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  const id = song.id
  const lyric = lyricMap[id]
  if (lyric) {
    return Promise.resolve(lyric)
  }
  return get('/lyric', { id }).then((res) => {
    const lyric = res ? res.lrc.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[id] = lyric
    return lyric
  })
}
