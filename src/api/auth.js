import axios from 'axios'
import { getCookie } from '../utils/cookie'

const api = axios.create({
  baseURL: '',
  withCredentials: true
})

// 添加响应拦截器来处理 DoorKey
api.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

// 登录接口
export const login = async (username, password) => {
  const response = await api.post('/user/login', {
    username,
    password
  })
  return response
}

// 设置请求拦截器，为每个请求添加 doorkey
api.interceptors.request.use(
  config => {
    const doorkey = getCookie('DoorKey')
    if (doorkey) {
      config.headers.Authorization = `Bearer ${doorkey}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default api
