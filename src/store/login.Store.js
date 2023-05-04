// 登录模块
import { makeAutoObservable } from "mobx"
import { http, setToken, getToken, removeToken } from '@/utils'

// # 安装mobx和中间件工具 mobx-react-lite  只能函数组件中使用
// $ yarn add  mobx  mobx-react-lite

class LoginStore {
  token = getToken() || ''
  constructor() {
    makeAutoObservable(this)
  }
  // 登录
  login = async ({ mobile, code }) => {
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile,
      code
    })
    this.token = res.data.token
    setToken(this.token)
  }
  loginOut = () => {
    this.token = ''
    removeToken()
  }
}
export default LoginStore