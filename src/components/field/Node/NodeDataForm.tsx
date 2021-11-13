import { DownOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Button, Dropdown, Form, Input, Menu } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Rule } from 'rc-field-form/lib/interface'
import { useContext, useMemo } from 'react'

import { NodeStoreContext } from '../../../store/node.store'
import { SchemaStoreContext } from '../../../store/schema.store'
import { FieldDataFormProps } from '../FieldDataForm'

interface Option {
  value: string
  label: string
}

interface NodeConfig {
  required?: boolean
}

function NodesList({ field, value, onChange }) {
  const router = useRouter()
  const { nodeSchemas } = useContext(SchemaStoreContext)
  const { addLocalNode, nodeById } = useContext(NodeStoreContext)

  const nodes = (value ?? []).map(nodeById).filter(Boolean)

  function addNode(schemaId: string) {
    const node = addLocalNode({ schemaId, data: {} })
    const newNodes = [...nodes, node.id]

    onChange(newNodes)
  }

  function removeOption(index: number) {
    const newOptions = [...nodes]
    newOptions.splice(index, 1)

    onChange(newOptions)
  }

  const menu = useMemo(
    () => (
      <Menu>
        {nodeSchemas.map((schema) => (
          <Menu.Item key={schema.id} onClick={() => addNode(schema.id)}>
            {schema.name}
          </Menu.Item>
        ))}
      </Menu>
    ),
    [nodeSchemas],
  )

  const canAddMore = useMemo(() => !field.config.max || nodes.length < field.config.max, [
    nodes,
    field.config,
  ])

  return (
    <>
      {nodes.map((node, index) => {
        return (
          <Form.Item key={index}>
            <Input.Group compact style={{ display: 'flex' }}>
              <Link href={`${router.asPath}/${field.key}/${node.id}`}>
                <Button>Check</Button>
              </Link>
              <Form.Item noStyle>
                <Button shape="circle" type="link" onClick={() => removeOption(index)}>
                  <MinusCircleOutlined />
                </Button>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        )
      })}

      {canAddMore && (
        <Form.Item>
          <Dropdown overlay={menu}>
            <Button>
              Add new node <DownOutlined />
            </Button>
          </Dropdown>
        </Form.Item>
      )}
    </>
  )
}

export function NodeDataForm({ field }: FieldDataFormProps<NodeConfig>) {
  const rules: Rule[] = []
  //[{ required: field.config.required }]

  return (
    <Form.Item label={field.name} name={field.key} rules={rules} help={field.description || null}>
      <NodesList field={field} />
    </Form.Item>
  )
}
