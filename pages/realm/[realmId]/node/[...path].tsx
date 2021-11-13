import { Button, Form } from 'antd'
import Title from 'antd/lib/typography/Title'
import { useContext } from 'react'

import { FieldDataForm } from '../../../../src/components/field/FieldDataForm'
import { NodeStoreContext } from '../../../../src/store/node.store'

export default function NodePage() {
  const { currentNode, currentSchema, updateNode } = useContext(NodeStoreContext)

  function onUpdateNodeSubmit(data) {
    updateNode(currentNode.realmId, currentNode.id, { data })
  }

  if (!currentNode || !currentSchema) {
    return <></>
  }

  return (
    <div className="NodePage">
      <Title>{currentNode.name}</Title>

      <div className="node-container">
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 10 }}
          layout="horizontal"
          initialValues={currentNode.data}
          onFinish={onUpdateNodeSubmit}>
          {currentSchema.fields.map((field) => (
            <FieldDataForm key={field.id} field={field} data={currentNode.data} />
          ))}

          <Form.Item wrapperCol={{ offset: 4, span: 4 }}>
            <Button type="primary" htmlType="submit">
              Update node
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
