import axios from 'axios'

const ins = axios.create({
  baseURL: 'http://localhost:3000/'
})


export function get(url, params) {
  return ins.get(url, { params }).then((res) => {
    if (res.data.code === 200) {
      return res.data
    }
  }).catch((e) => {
    console.log(e)
  })
}
