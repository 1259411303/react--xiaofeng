import { Card,Button, Checkbox, Form, Input, message } from 'antd'
import logo from '@/assets/logo.png'
import './index.scss'
// import { useStore } from "@/store/index.js";
import { useStore } from '../../store/index'
import { observer } from 'mobx-react-lite'
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginStore } = useStore()
  const navigate = useNavigate()
  const onFinish = async (values) => {
    console.log('Success:', values);
    const {mobile, code} = values
    try {
      await loginStore.login({ mobile, code })
      navigate('/')
      message.success('登录成功')
    } catch (e) {
      // message.error(e.response?.data?.message || '登录失败')
    }
    
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        <Form
          validateTrigger={['onBlur', 'onChange']}
          name="basic"
          initialValues={{
            remember: true,
            mobile: '13811111111',
            code: '246810'
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="手机号"
            name="mobile"
            rules={[
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号码格式不对',
                validateTrigger: 'onBlur'
              },
              { required: true, message: '请输入手机号' }
            ]}
          >
            <Input size="large" placeholder="请输入手机号"/>
          </Form.Item>

          <Form.Item
            label="验证码"
            name="code"
            rules={[
              { len: 6, message: '验证码6个字符', validateTrigger: 'onBlur' },
              { required: true, message: '请输入验证码' }
            ]}
          >
            <Input.Password size="large" placeholder="请输入验证码" />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
          >
            <Checkbox>我已阅读并同意「用户协议」和「隐私条款」</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

// export default Login
export default observer(Login)