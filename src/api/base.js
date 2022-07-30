import axios from 'axios'

const ins = axios.create({
  baseURL: 'http://localhost:3000/'
})

export function get(url, params) {
  return ins.get(url, { params }).then((res) => {
    if (res.data.code === 200) {
      return res.data
    } else if (res.data.code === 405) {
      alert('接口请求频繁')
      return
    }
  }).catch((e) => {
    console.log(e)
  })
}
