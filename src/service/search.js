import { get, flag } from './base'
import {
  getHotKeys as getHotKeysV2,
  search as searchV2
} from '@/api/search'

export function getHotKeys() {
  return flag ? getHotKeysV2() : get('/api/getHotKeys')
}

export function search(query, page, showSinger) {
  return flag ? searchV2(query, page, showSinger) : get('/api/search', {
    query,
    page,
    showSinger
  })
}

