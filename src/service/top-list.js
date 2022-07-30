import { get, flag } from './base'
import {
  getTopList as getTopListV2,
  getTopDetail as getTopDetailV2
} from '@/api/top-list'

export function getTopList() {
  return flag ? getTopListV2() : get('/api/getTopList')
}

export function getTopDetail(top) {
  return flag ? getTopDetailV2(top) : get('/api/getTopDetail', { id: top.id, period: top.period })
}
