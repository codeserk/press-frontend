import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Form, FormInstance, Input } from 'antd'
import { NodeEntityTypeEnum } from 'core/client'
import { Node } from 'core/modules/nodes/node.interface'
import { NodeStoreContext } from 'core/modules/nodes/node.store'
import { SchemaStoreContext } from 'core/modules/schemas/schema.store'
import { useContext, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { formHasError } from '../../util/form'
import { FieldDataForm } from '../field/FieldDataForm'

interface Props {
  node: Node
}

export function NodeForm({ node }: Props) {
  const $form = useRef<FormInstance<any>>()

  const { isLoading, nodeById, updateNode, saveLocalNode } = useContext(NodeStoreContext)
  const { schemaById } = useContext(SchemaStoreContext)

  const schema = schemaById(node.schemaId)

  function onSubmit(params) {
    const { name, slug, ...data } = params

    // Normalize node data fields
    for (const field of schema.fields) {
      if (field.primitive === 'node') {
        const fieldNodes = Array.isArray(data[field.key]) ? data[field.key] : []

        data[field.key] = fieldNodes.map((id) => nodeById(id)?.id).filter(Boolean)
      }
    }

    if (node.isNew) {
      saveLocalNode(node.id, {
        name,
        slug,
        schemaId: node.schemaId,
        type: node.type as any,
        data,
      })
    } else {
      updateNode(node.realmId, node.id, { name, data })
    }
  }

  useEffect(() => {
    $form.current?.resetFields()

    if (node) {
      $form.current?.setFieldsValue({ ...node, ...node?.data })
    }
  }, [node, schema])

  return (
    <Container ref={$form} layout="vertical" size="large" colon={false} onFinish={onSubmit}>
      <Form.Item label="Name" name="name">
        <Input />
      </Form.Item>

      <Form.Item label="Slug" name="slug">
        <Input />
      </Form.Item>

      <Divider orientation="left">Data</Divider>
      {!!node &&
        schema?.fields.map((field) => (
          <FieldDataForm key={field.id} node={node} field={field} data={node.data} />
        ))}

      {node.type === NodeEntityTypeEnum.Scene && (
        <div className="node-container">
          <Divider orientation="left">Views</Divider>
        </div>
      )}

      {node.type === NodeEntityTypeEnum.View && (
        <div className="node-container">
          <Divider orientation="left">Children</Divider>
        </div>
      )}

      <Form.Item wrapperCol={{ offset: 4, span: 4 }} shouldUpdate>
        {(form) => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={formHasError(form) }
            loading={isLoading}>
            {node.isNew && <PlusOutlined />}
            {!node.isNew && <EditOutlined />}
            {node.isNew ? 'Create node' : 'Update node'}
          </Button>
        )}
      </Form.Item>
    </Container>
  )
}

// Styles

const Container = styled(Form)`
  .ant-form-item {
    margin-bottom: 6px;
  }

  .ant-form-item-label {
    line-height: 1;
    padding: 0;
    font-weight: bold;
    text-transform: capitalize;
  }
`
