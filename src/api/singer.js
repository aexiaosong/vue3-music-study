import { get } from './base'
import pinyin from 'pinyin'

export function getSingerList() {
  return get('/top/artists?offset=0&limit=80').then(res => {
    const singers = res.artists
    // 构造歌手 Map 数据结构
    const singerMap = {
      hot: {
        title: '热',
        list: map(singers.slice(0, 10))
      }
    }

    singers.forEach((item) => {
      // 把歌手名转成拼音
      const p = pinyin(item.name)
      if (!p || !p.length) {
        return
      }
      // 获取歌手名拼音的首字母
      const key = p[0][0].slice(0, 1).toUpperCase()
      if (key) {
        if (!singerMap[key]) {
          singerMap[key] = {
            title: key,
            list: []
          }
        }
        // 每个字母下面会有多名歌手
        singerMap[key].list.push(map([item])[0])
      }
    })

    // 热门歌手
    const hot = []
    // 字母歌手
    const letter = []

    // 遍历处理 singerMap，让结果有序
    for (const key in singerMap) {
      const item = singerMap[key]
      if (item.title.match(/[a-zA-Z]/)) {
        letter.push(item)
      } else if (item.title === '热') {
        hot.push(item)
      }
    }
    // 按字母顺序排序
    letter.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return { singers: hot.concat(letter) }
  })
}

function map(singerList) {
  return singerList.map(item => {
    return {
      id: item.id,
      mid: item.id,
      name: item.name,
      pic: item.picUrl
    }
  })
}

export async function getSingerDetail(singer) {
  let { songs } = await get('/artist/top/song', { id: singer.id })
  // const ids = songs.map(s => s.id).join(',')
  // const { songs: songsTime } = await get('/song/detail', { ids })
  // const dtMap = songsTime.reduce((pre, cur) => {
  //   pre[cur.id] = cur.dt
  //   return pre
  // }, {})
  // TODO: songs fee
  songs = songs.filter(song => song.fee !== 1)
  return { songs: songs.map(song => {
    return {
      id: song.id,
      mid: song.id,
      album: song.al.name,
      name: song.name,
      pic: song.al.picUrl,
      singer: song.ar.map(s => s.name).join('/'),
      url: '',
      // duration: dtMap[song.id] / 1000 | 0
    }
  }) }
}