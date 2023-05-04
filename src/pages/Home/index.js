

// 思路：
// 1、看官方文档 把echart加入项目 
//  如何在react获取dom  -> useRef
//  在什么地方获取dom节点 -> useEffect
// 2、不抽离定制化的参数	先把最小化的dom跑起来
// 3、按照需求，哪些参数需要自定义 抽象出来

import Bar from "@/components/Bar";


function Home () {
  return (
    <div>
      {/* {渲染Bar组件} */}
      <Bar 
        title='主流框架满意度'
        xData={['react', 'vue', 'angular']}
        yData={[30, 40, 50]}
        style={{width: '500px', height: '400px'}}/>
      <Bar 
        title='主流框架满意度2'
        xData={['react2', 'vue3', 'angular4']}
        yData={[60, 70, 80]}
        style={{width: '300px', height: '200px'}}/>
    </div>
  )
}

export default Home