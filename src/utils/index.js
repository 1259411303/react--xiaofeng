// 先把所有的工具函数导出的模块在这里导入
// 然后在统一导出

import { http } from './http'
import { getToken, setToken, removeToken } from './token'

export {
  http,
  getToken, 
  setToken, 
  removeToken
}