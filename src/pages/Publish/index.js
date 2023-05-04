import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import './index.scss'
import { http } from "@/utils/index"
import { useRef, useEffect } from "react";

import { useStore } from "@/store";
import { observer } from 'mobx-react-lite'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import { useState } from 'react'

const { Option } = Select


const Publish = () => {
  const navigate = useNavigate()
  const { channelStore } = useStore()

  // 1. 声明一个暂存仓库
  const fileListRef = useRef([])

  const [fileList, setFileList] = useState([])
  // 上传成功回调
  // const onUploadChange = info => {
  //   const fileList = info.fileList.map(file => {
  //     console.log("fileList",setFileList(fileList))
  //     if (file.response) {
  //       return {
  //         url: file.response.data.url
  //       }
  //     }
  //     return file
  //   })
  //   setFileList(fileList)
  // }

  const onUploadChange = ({fileList}) => {
    console.log("fileList", fileList)
    // 采取受控组件的写法：在最好一次log里response
    // 最终react state fileList 中存放的数据有response.data.url


    // 这里关键位置： 需要做数据格式化
    const formatList = fileList.map(file => {
      // 上传完毕 做数据处理
      if (file.response) {
        return {
          url: file.response.data.url
        }
      }
      // 否则在上传时，不做处理
      return file
    })

    setFileList(formatList)
    // 2. 上传图片时，将所有图片存储到 ref 中
    fileListRef.current = formatList
  }

  // 切换上传图片的数量
  const [imgCount, setImgCount] = useState(1)
  const changeType = e => {
    // 这里的判断依据我们采取原始值 不采取经过useState方法修改之后的数据
    // useState修改之后的数据 无法同步获取修改之后的新值

    // 使用原始数据作为判断条件
    const count = e.target.value
    setImgCount(count)

    if (count === 1) {
      // 单图，只展示第一张
      const firstImg = fileListRef.current[0]
      setFileList(!firstImg ? [] : [firstImg])
    } else if (count === 3) {
      // 三图，展示所有图片
      setFileList(fileListRef.current)
    }
  }

  // 提交表单
  const onFinish = async (values) => {
    console.log("发表文章", values)
    const { channel_id, content, title, type } = values
    const params = {
      channel_id, 
      content, 
      title, 
      type,
      cover: {
        type,
        images: fileList.map(item => item.url)
      }
    }
    console.log("params", params)
    if(articleId){
      // 编辑
      await http.put(`/mp/articles/${articleId}?draft=false`,params)
    }else{
      // 新增
      await http.post('/mp/articles?draft=false', params)
    }

    // 跳转列表 提示用户
    navigate('/artical') 
    message.success(`${articleId ? '更新成功' : '发布成功'}`)

  }

  // 编辑功能
  // 文案适配  路由参数id 判断条件
  const [params] = useSearchParams()
  const articleId = params.get('id')
  console.log("route", articleId)

  // 数据回填 id调用接口 1、表单回填  2、暂存列表  3、Upload组件fileList
  const formRef = useRef()

  useEffect (() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${articleId}`)
      console.log("res", res)
      const data = res.data
      // 表单数据回填 实例方法
      formRef.current.setFieldsValue({ ...data, type: data.cover.type })

      // 调用setFileList方法回填upload
      // const formatImgList = data.cover.images.map(url => {
      //   return {
      //     url
      //   }
      // })
      const formatImgList = data.cover.images.map(url => ({url}))

      setFileList(formatImgList) 
      // 暂存列表也存一份 （暂存列表和 fileList 回显列表保持数据结构统一）
      fileListRef.current = formatImgList
    }
    // 必须是编辑状态 才可以发送请求
    if (articleId) {
      loadDetail()
      console.log("formRef", formRef)
    }
  },[articleId])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{articleId ? '编辑' : '发布'}文章</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          // 注意：此处需要为富文本编辑表示的 content 文章内容设置默认值
          initialValues={{ type: 1, content: '' }}
          onFinish={onFinish}
          ref={formRef}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
            { 
                channelStore.channelList.map(channel => 
                  <Option value={channel.id} key={channel.id}>{channel.name}</Option>)
              }
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
            <Radio.Group onChange={changeType}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imgCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                onChange={onUploadChange}
                multiple={imgCount > 1}
                maxCount={ imgCount }
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
              {articleId ? '更新' : '发布'}文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)