import { faFont } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Divider, Form, Input, List } from 'antd'
import Title from 'antd/lib/typography/Title'
import Link from 'next/link'
import { useContext } from 'react'

import { RealmStoreContext } from '../../../../../src/store/realm.store'
import { SchemaStoreContext } from '../../../../../src/store/schema.store'

export default function SchemaPage() {
  const [form] = Form.useForm()

  const { currentRealm } = useContext(RealmStoreContext)
  const { currentSchema, fieldsInCurrentSchema, createField } = useContext(SchemaStoreContext)

  function createFieldHandler(params) {
    createField(currentRealm.id, currentSchema.id, params.name)

    form.resetFields()
  }

  if (!currentSchema) {
    return <></>
  }

  return (
    <div className="SchemaPage">
      <Title>{currentSchema.name}</Title>

      <Divider orientation="left">Fields</Divider>

      <Form form={form} name="create-field" layout="inline" onFinish={createFieldHandler}>
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
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length).length
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
          <List.Item>
            <List.Item.Meta
              avatar={<FontAwesomeIcon icon={faFont} />}
              title={
                <Link
                  href={`/realm/${currentRealm.id}/schema/${currentSchema.id}/field/${field.id}`}>
                  {field.name}
                </Link>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )
}
