export function formatTime(interval) {
  interval = interval | 0
  const minute = ((interval / 60 | 0) + '').padStart(2, '0')
  const second = ((interval % 60) + '').padStart(2, '0')
  return `${minute}:${second}`
}

export function shuffle(list) {
  const arr = list.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

/**
 * 返回0到max之间的值，双闭区间
 * @param {number} max 可取的最大值
 * @returns 随机数
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1))
}

/**
 * 交互数组的元素
 * @param {Array.<number>} list 待交换数组
 * @param {number} i 带交换元素
 * @param {number} j 带交换元素
 */
function swap(list, i, j) {
  const tmp = list[i];
  list[i] = list[j];
  list[j] = tmp;
}
