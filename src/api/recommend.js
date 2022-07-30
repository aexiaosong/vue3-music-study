import { get } from './base'

export async function getAlbum(album) {
  return await get('/playlist/track/all', { id: album.id }).then(res => {
    const fee = res.privileges.filter(e => e.fee === 1)
    const songs = res.songs.filter(e => !~fee.findIndex(f => f.id === e.id))
    return { songs: songs.map(e => {
      return {
        id: e.id,
        mid: e.id,
        album: e.al.name,
        name: e.name,
        pic: e.al.picUrl,
        singer: e.ar.map(s => s.name).join('/'),
        url: ''
      }
    }) }
  })
}

export async function getRecommend() {
  const albums = await getAlbums()
  const sliders = await getBanner()
  return { albums, sliders }
}

export function getAlbums() {
  return get('/top/playlist?limit=10&order=hot').then(res => {
    return res.playlists.map(e => {
      return {
        id: e.id,
        pic: e.coverImgUrl,
        title: e.name,
        username: e.creator.nickname
      }
    })
  })
}

export function getBanner() {
  return get('/banner?type=2').then(res => {
    return res.banners.map(b => {
      return {
        id: b.bannerId,
        link: 'javascript:;',
        pic: b.pic
      }
    })
  })
}
