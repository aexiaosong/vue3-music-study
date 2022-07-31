import storage from 'good-storage'

function insertArray(list, val, compare, maxLen) {
  const index = list.findIndex(compare)
  if (index === 0) return
  if (index > 0) {
    list.splice(index, 1)
  }
  list.unshift(val)
  if (maxLen && list.length > maxLen) {
    list.pop()
  }
}

function deleteFromArray(list, compare) {
  const index = list.findIndex(compare)
  if (index > -1) {
    list.splice(index, 1)
  }
}

export function save(key, item, compare, maxLen) {
  const list = storage.get(key, [])
  insertArray(list, item, compare, maxLen)
  storage.set(key, list)
  return list
}

export function remove(key, compare) {
  const list = storage.get(key, [])
  deleteFromArray(list, compare)
  storage.set(key, list)
  return list
}

export function load(key) {
  return storage.get(key, [])
}

export function clear(key) {
  storage.remove(key)
  return []
}
