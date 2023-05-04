// BrowserRouter 替换为：unstable_HistoryRouter as HistoryRouter 
// 跳转到登录 reactRouter默认状态下 并不支持在组件之外完成跳转

import { unstable_HistoryRouter as HistoryRouter, Route, Routes } from "react-router-dom";
import { history } from "@/utils/history";

import { AuthComponent } from "@/components/AuthComponent";

// import Layout from "@/pages/Layout";
// import Login from "@/pages/Login";

// import Home from "@/pages/Home";
// import Artical from "@/pages/Artical";
// import Publish from "@/pages/Publish";

// 导入必要组件
import { lazy, Suspense } from 'react'
// 按需导入路由组件
const Login = lazy(() => import('./pages/Login'))
const Layout = lazy(() => import('./pages/Layout'))
const Home = lazy(() => import('./pages/Home'))
const Artical = lazy(() => import('./pages/Artical'))
const Publish = lazy(() => import('./pages/Publish'))


function App() {
  return (
    <HistoryRouter history={history}>
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{
                textAlign: 'center',
                marginTop: 200
              }}
            >
              loading...
            </div>
          }
        >
          <Routes>
            {/* { 创建路由path和element对应关系 } */}
            {/* { Layout需要鉴权处理 } */}
            {/* { 这里的Layout首页一定不能写死 要根据是否登录进行判断 } */}
            <Route path="/" element={
              <AuthComponent>
                <Layout/>
              </AuthComponent>
            }>
              <Route index element={<Home/>}/>
              <Route path="/Artical" element={<Artical/>}/>
              <Route path="/Publish" element={<Publish/>}/>
            </Route>
            <Route path="/login" element={<Login/>}/>
          </Routes>
          </Suspense>
      </div>
    </HistoryRouter>
    
  );
}

export default App;
