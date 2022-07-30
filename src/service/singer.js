import { get, flag } from './base'
import {
  getSingerList as getSingerListV2,
  getSingerDetail as getSingerDetailV2
} from '@/api/singer'

export function getSingerList() {
  return flag ? getSingerListV2() : get('/api/getSingerList')
}

export function getSingerDetail(singer) {
  return flag ? getSingerDetailV2(singer) : get('/api/getSingerDetail', {
    mid: singer.mid
  })
}
