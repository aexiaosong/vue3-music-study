import { get, flag } from './base'
import {
  getRecommend as getRecommendV2,
  getAlbum as getAlbumV2
} from '@/api/recommend'

export function getRecommend() {
  return flag ? getRecommendV2() : get('/api/getRecommend')
}

export function getAlbum(album) {
  return flag ? getAlbumV2(album) : get('/api/getAlbum', { id: album.id })
}
