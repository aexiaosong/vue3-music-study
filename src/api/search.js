import { get } from './base'

export async function getHotKeys() {
  const res = await get('/search/hot')
  const hotKeys = res.result.hots.map(hot => {
    return {
      id: Math.random().toString(36).substring(2, 7),
      key: hot.first
    }
  })
  return { hotKeys }
}

const searchSingerCache = {}

export async function search(query, page, showSinger) {
  let singers = []
  if (showSinger) {
    // 查询歌手信息，精确歌手需要使用这个接口以便过滤其他同名账号
    singers = searchSingerCache[query] ? searchSingerCache[query] : await searchSingers(query)
    searchSingerCache[query] = singers
  }
  // 查询歌曲
  const result = await get('/search', { keywords: query, offset: page - 1 }).then(res => {
    const result = res.result
    let songs = result.songs.filter(song => song.fee !== 1)
    songs = songs.map(song => {
      return {
        id: song.id,
        mid: song.id,
        duration: song.duration / 1000 | 0,
        pic: '',
        album: song.album.name,
        singer: song.artists.map(a => a.name).join('/'),
        name: song.name
      }
    })
    return {
      songs,
      hasMore: result.hasMore
    }
  })
  
  return {
    singers,
    songs: result.songs,
    hasMore: result.hasMore
  }
}

function searchSingers(query) {
  return get('/search/suggest', { keywords: query }).then(res => {
    const result = res.result
    if (result.artists) {
      const singers = result.artists.map(singer => {
        return {
          id: singer.id,
          mid: singer.id,
          pic: singer.picUrl + '?param=600y600',
          name: singer.name
        }
      })
      // let songs = result.songs.filter(song => song.fee !== 1)
      // songs = songs.map(song => {
      //   return {
      //     id: song.id,
      //     singer: song.artists.map(a => a.name).join('/'),
      //     name: song.name
      //   }
      // })
      return singers
    } else {
      return []
    }
  })
}
