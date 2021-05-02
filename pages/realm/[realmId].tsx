import { Button, Divider, Form, Input, Select } from 'antd'
import { useContext } from 'react'

import { NodeStore, NodeStoreContext } from '../../src/store/node.store'
import { RealmStore, RealmStoreContext } from '../../src/store/realm.store'
import { SchemaStore, SchemaStoreContext } from '../../src/store/schema.store'

export default function RealmPage() {
  const { currentRealm } = useContext<RealmStore>(RealmStoreContext)
  const { schemas, createSchema } = useContext<SchemaStore>(SchemaStoreContext)
  const { createNode } = useContext<NodeStore>(NodeStoreContext)

  function onCreateSchemaSubmit(params) {
    createSchema(params.name)
  }

  function onCreateNodeSubmit(params) {
    createNode(currentRealm.id, params)
  }

  return (
    <div className="RealmPage">
      <Divider orientation="left">Create schema</Divider>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 10 }}
        layout="horizontal"
        onFinish={onCreateSchemaSubmit}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 4 }}>
          <Button type="primary" htmlType="submit">
            Create Schema
          </Button>
        </Form.Item>
      </Form>

      <Divider orientation="left">Create scene</Divider>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 10 }}
        layout="horizontal"
        onFinish={onCreateNodeSubmit}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Home page" />
        </Form.Item>
        <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
          <Input placeholder="/" />
        </Form.Item>

        <Form.Item label="Schema" name="schemaId" rules={[{ required: true }]}>
          <Select>
            {schemas.map((schema) => (
              <Select.Option key={schema.id} value={schema.id}>
                {schema.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 4 }}>
          <Button type="primary" htmlType="submit">
            Create Schema
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
