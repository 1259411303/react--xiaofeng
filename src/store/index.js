import React from "react"
import LoginStore from './login.Store'
import UserStore from './user.Store'
import ChannelStore from './channel.Store'

// # 安装mobx和中间件工具 mobx-react-lite  只能函数组件中使用
// $ yarn add  mobx  mobx-react-lite

class RootStore {
  // 组合模块
  constructor() {
    this.loginStore = new LoginStore()
    this.userStore = new UserStore()
    this.channelStore = new ChannelStore()
  }
}

// const rootStore = new RootStore() 
// const context = React.createContext(rootStore)
// const useStore = () => React.useContext(context)
// export { useStore }

// 导入useStore方法供组件使用数据
const StoresContext = React.createContext(new RootStore())
export const useStore = () => React.useContext(StoresContext)