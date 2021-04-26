import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Form, Input } from 'antd'
import { Rule } from 'rc-field-form/lib/interface'
import { ChangeEvent, FormEvent, useMemo, useState } from 'react'

import { getAuthStore } from '../../src/store/store'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

export default function RegisterPage() {
  const [loginFailed, setLoginFailed] = useState(false)
  const { jwt, login, isLoading } = getAuthStore()

  console.log('login failed?', loginFailed)

  async function onSubmit({ email, password }) {
    const result = await login(email, password)

    setLoginFailed(!result)
  }

  return (
    <div className="LoginPage">
      {loginFailed}
      <br />
      {jwt}
      <Card title="Login" style={{ maxWidth: 400, margin: 'auto' }}>
        <Form
          {...layout}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          onFieldsChange={() => setLoginFailed(false)}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            help={loginFailed ? 'Invalid credentials' : undefined}
            validateStatus={loginFailed ? 'error' : undefined}
            rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
