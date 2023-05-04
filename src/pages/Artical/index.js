import { Link } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space } from 'antd'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { http } from "@/utils/index"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { observer } from 'mobx-react-lite'

import img404 from '@/assets/error.png'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {

  const { channelStore } = useStore()

  // // 频道列表管理
  // const [channelList, setChannelList] = useState([])
  // // useEffect的依赖非常必要 非常容易出现循环执行
  // // 在里面写了引起组件重新渲染的逻辑 重新渲染又会导致useEffect执行
  // useEffect(() => {
  //   const loadChannelList = async () => {
  //     const res = await http.get('/channels')
  //     setChannelList(res.data.channels)
  //   }
  //   loadChannelList()
  // },[])

  // 文章列表管理 统一管理数据 将来修改给setList传对象
  const [articalData, setArticalData] = useState({
    list: [], //文章列表
    count: 0	//文章数量
  })
  
  // 文章参数管理 
  const [params, setParams] = useState({
    page: 1,
    per_page: 3
  })
  // 如果异步请求函数需要依赖一些数据的变化而重新执行
  // 推荐把他写到内部
  // 统一不抽离函数到外面 只要涉及到异步请求函数 都放到useEffect
  // 本质区别：写到外面每次组件更新都会重新进行函数初始化 这本身就是一次性能消耗
  // 避免性能损失

  useEffect(() => {
    const loadList = async () => {
      const res = await http.get('/mp/articles', {params})
      console.log("res222",res)
      const { results, total_count } = res.data
      setArticalData({
        list: results,
        count: total_count
      })
    }
    loadList()
  },[params])

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width:120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      // render: data => <Tag color="green">审核通过</Tag>
      render: data => formatStatus(data)
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button 
              type="primary" 
              shape="circle" 
              icon={<EditOutlined />} 
              onClick={() => goPubilsh(data)}
            />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => delArticle(data)}
            />
          </Space>
        )
      }
    }
  ]

  const onFinish = (values) => {
    console.log("values", values)
    const { status, channel_id, date } = values

    // 格式化表单数据
    const _params = {}
    // 格式化status
    _params.status = status
    if (channel_id) {
      console.log("11111111111")
      _params.channel_id = channel_id
    }
    if (date) {
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    // 修改params参数 触发接口再次发起 对象的合并是一个整体覆盖 改变了对象的整体引用
    setParams({
       ...params,
       ..._params,
    })
  }

  const pageChange = (page) => {
    console.log("page", page)
    setParams({
      ...params,
      page
    })
  }

  const formatStatus = (type) => {
    console.log("type", type)
    const TYPES = {
      1: <Tag color="red">审核失败</Tag>,
      2: <Tag color="green">审核成功</Tag>
    }
    // console.log("TYPES", TYPES)
    // console.log("TYPES[type]", TYPES[type])
    return TYPES[type]
  }

  // 删除
  const delArticle = async (data) => {
    console.log("删除", data)
    await http.delete(`/mp/articles/${data.id}`)
    // setArticalData({
    //   ...articalData,
    //   list: articalData.list.filter((item) => item.id !== data.id)
    // })
    setParams({
      ...params,
      page: 1,
      per_page: 3
    })
  }

  // 编辑
  const navigate = useNavigate()
  const goPubilsh = (data) => {
    navigate(`/publish?id=${data.id}`)
  }

  return (
    <div>
      {/* 筛选区域 */}
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form 
          onFinish={ onFinish }
          initialValues={{status: -1}}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={-1}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 280 }}
            >
              
              { 
                channelStore.channelList.map(channel => 
                  <Option value={channel.id} key={channel.id}>{channel.name}</Option>)
              }
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 文章区域 */}
      <Card title={`根据筛选条件共查询到 ${articalData.count} 条结果：`}>
        <Table 
          rowKey="id" 
          columns={columns} 
          dataSource={articalData.list}
          pagination={{
            pageSize: params.per_page,
            total: articalData.count,
            onChange: pageChange
          }} />
      </Card>
    </div>
  )
}

export default observer(Article)