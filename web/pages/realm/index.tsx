import { Button, Divider, Form, Input } from 'antd'
import Title from 'antd/lib/typography/Title'
import { RealmStoreContext } from 'core/modules/realms/realm.store'
import { useContext } from 'react'

export default function RealmsPage() {
  const [form] = Form.useForm()
  const { createRealm } = useContext(RealmStoreContext)

  function createRealmHandler(params) {
    createRealm(params.name)

    form.resetFields()
  }

  return (
    <div className="RealmsPage">
      <Title>Realms</Title>

      <Divider orientation="left">Create realm</Divider>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 10 }}
        layout="horizontal"
        onFinish={createRealmHandler}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 4 }}>
          <Button type="primary" htmlType="submit">
            Create realm
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
