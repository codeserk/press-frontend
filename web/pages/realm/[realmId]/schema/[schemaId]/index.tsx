import { Button, Divider, Form, Input, List, Popconfirm, Radio, Select, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import { RealmStoreContext } from 'core/modules/realms/realm.store'
import { SchemaStoreContext } from 'core/modules/schemas/schema.store'
import Link from 'next/link'
import { useContext, useEffect } from 'react'

import { PRIMITIVES } from '../../../../../src/interfaces/primitive.interface'

function SchemaField({ realm, schema, field }) {
  const icon = PRIMITIVES[field.primitive].icon

  return (
    <List.Item>
      <List.Item.Meta
        avatar={icon}
        title={
          <Link href={`/realm/${realm.id}/schema/${schema.id}/field/${field.id}`}>
            {field.name}
          </Link>
        }
      />
    </List.Item>
  )
}

export default function SchemaPage() {
  const { currentRealm } = useContext(RealmStoreContext)
  const {
    currentSchema,
    updateSchema,
    deleteSchema,
    fieldsInCurrentSchema,
    createField,
  } = useContext(SchemaStoreContext)

  const [updateSchemaForm] = Form.useForm()
  const [addFieldForm] = Form.useForm()

  async function addFieldHandler(params) {
    await createField(currentRealm.id, currentSchema.id, params.name)

    addFieldForm.resetFields()
  }

  async function onUpdateSchemaSubmitted(values) {
    await updateSchema(currentRealm.id, currentSchema.id, values)
  }

  useEffect(() => {
    updateSchemaForm.resetFields()

    if (!currentSchema) {
      updateSchemaForm.setFieldsValue({ ...currentSchema })
    }
  }, [currentSchema])

  if (!currentSchema) {
    return <></>
  }

  return (
    <div className="SchemaPage">
      <Title>{currentSchema.name}</Title>

      <Divider orientation="left">Config</Divider>
      <Form
        form={updateSchemaForm}
        colon={false}
        initialValues={{ ...currentSchema }}
        labelCol={{ span: 1 }}
        onFinish={onUpdateSchemaSubmitted}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio.Button value="scene">Scene</Radio.Button>
            <Radio.Button value="model">Model</Radio.Button>
            <Radio.Button value="view">View</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item shouldUpdate>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                !!updateSchemaForm.getFieldsError().filter(({ errors }) => errors.length).length
              }>
              Update
            </Button>
          )}
        </Form.Item>
      </Form>

      <Divider orientation="left">Fields</Divider>
      <Form form={addFieldForm} name="add-field" layout="inline" onFinish={addFieldHandler}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input the field name!' }]}>
          <Input placeholder="Field name" />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                !addFieldForm.isFieldsTouched(true) ||
                !!addFieldForm.getFieldsError().filter(({ errors }) => errors.length).length
              }>
              Create
            </Button>
          )}
        </Form.Item>
      </Form>

      <br />

      <List
        itemLayout="horizontal"
        dataSource={fieldsInCurrentSchema}
        bordered
        renderItem={(field) => (
          <SchemaField key={field.id} realm={currentRealm} schema={currentSchema} field={field} />
        )}
      />

      <Divider type="horizontal" orientation="left" className="danger">
        Danger zone
      </Divider>

      <Popconfirm
        title="Are you sure?"
        onConfirm={() => deleteSchema(currentRealm.id, currentSchema.id)}>
        <Button danger>Delete schema</Button>
      </Popconfirm>
    </div>
  )
}
