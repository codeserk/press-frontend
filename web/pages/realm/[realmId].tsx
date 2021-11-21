import { Button, Divider, Form, Input, Select } from 'antd'
import { CreateNodeRequestTypeEnum } from 'core/client'
import { NodeStore, NodeStoreContext } from 'core/modules/nodes/node.store'
import { RealmStore, RealmStoreContext } from 'core/modules/realms/realm.store'
import { SchemaStore, SchemaStoreContext } from 'core/modules/schemas/schema.store'
import { useContext } from 'react'

export default function RealmPage() {
  const { currentRealm } = useContext<RealmStore>(RealmStoreContext)
  const { sceneSchemas, modelSchemas, createSchema } = useContext<SchemaStore>(SchemaStoreContext)
  const { createNode } = useContext<NodeStore>(NodeStoreContext)

  function onCreateSchemaSubmit(params) {
    createSchema(currentRealm.id, params)
  }

  function onCreateNodeSubmit(params, type: CreateNodeRequestTypeEnum) {
    createNode(currentRealm.id, { ...params, type })
  }

  return (
    <div className="RealmPage">
      <Divider orientation="left">Create schema</Divider>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 10 }}
        layout="horizontal"
        onFinish={onCreateSchemaSubmit}>
        <Form.Item label="Type" name="type" rules={[{ required: true }]} initialValue="scene">
          <Select>
            <Select.Option value="scene">Scene</Select.Option>
            <Select.Option value="model">Model</Select.Option>
            <Select.Option value="view">View</Select.Option>
          </Select>
        </Form.Item>
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
        onFinish={(params) => onCreateNodeSubmit(params, CreateNodeRequestTypeEnum.Scene)}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Home page" />
        </Form.Item>
        <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
          <Input placeholder="/" />
        </Form.Item>

        <Form.Item label="Schema" name="schemaId" rules={[{ required: true }]}>
          <Select>
            {sceneSchemas.map((schema) => (
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

      <Divider orientation="left">Create model</Divider>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 10 }}
        layout="horizontal"
        onFinish={(params) => onCreateNodeSubmit(params, CreateNodeRequestTypeEnum.Model)}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Home page" />
        </Form.Item>
        <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
          <Input placeholder="/" />
        </Form.Item>

        <Form.Item label="Schema" name="schemaId" rules={[{ required: true }]}>
          <Select>
            {modelSchemas.map((schema) => (
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
