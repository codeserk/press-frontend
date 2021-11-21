import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Dropdown, Form, List, Menu, Select } from 'antd'
import { NodeEntityTypeEnum, SchemaEntity } from 'core/client'
import { Color } from 'core/interfaces/color.type'
import { Node } from 'core/modules/nodes/node.interface'
import { NodeStoreContext } from 'core/modules/nodes/node.store'
import { RealmStoreContext } from 'core/modules/realms/realm.store'
import { SchemaStoreContext } from 'core/modules/schemas/schema.store'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Rule } from 'rc-field-form/lib/interface'
import { useContext, useMemo } from 'react'
import styled from 'styled-components'

import { FieldDataFormProps } from '../FieldDataForm'

interface ViewConfig {
  required?: boolean
}

type NodeWithSchema = Node & { schema?: SchemaEntity }

function ViewsList({ node, field, value, onChange }) {
  const router = useRouter()

  const { currentRealmId } = useContext(RealmStoreContext)
  const { viewSchemas, modelSchemas, schemaById } = useContext(SchemaStoreContext)
  const {
    modelsBySchema,
    pathNodes,
    pathNodeIds,
    pathForNode,
    addLocalNode,
    nodeById,
    nodes,
  } = useContext(NodeStoreContext)

  const nodePath = useMemo(() => pathForNode(node.id), [pathNodes, node])
  const populatedNodes = useMemo(
    () =>
      (Array.isArray(value) ? value : [])
        .map((id) => {
          id = typeof id === 'string' ? id : id?.id
          node = nodeById(id)
          if (!node) {
            return
          }

          node.schema = schemaById(node.schemaId)

          return node
        })
        .filter(Boolean),
    [value, nodes, modelSchemas],
  )
  const nodeIds = useMemo(() => populatedNodes.map((node) => node.id), [populatedNodes])

  function addNewNode(schemaId: string) {
    const node = addLocalNode({
      name: '<new>',
      slug: '',
      type: NodeEntityTypeEnum.Model,
      realmId: currentRealmId,
      schemaId,
      data: {},
    })
    const newNodes = [...nodeIds, node.id]

    onChange(newNodes)
  }

  function addExistingNode(id: string) {
    const newNodes = [...nodeIds, id]

    onChange(newNodes)
  }

  function removeOption(index: number) {
    const newOptions = [...nodeIds]
    newOptions.splice(index, 1)

    onChange(newOptions)
  }

  const menu = useMemo(
    () => (
      <Menu>
        {viewSchemas.map((schema) => (
          <Menu.Item key={schema.id} onClick={() => addNewNode(schema.id)}>
            {schema.name}
          </Menu.Item>
        ))}
      </Menu>
    ),
    [modelSchemas, nodeIds],
  )

  const canAddMore = useMemo(() => !field.config.max || populatedNodes.length < field.config.max, [
    populatedNodes,
    field.config,
  ])

  return (
    <Container>
      <List className="nodes">
        {populatedNodes.map((node, index) => (
          <List.Item
            key={index}
            className={pathNodeIds.includes(node.id) ? 'active' : ''}
            onClick={() =>
              router.push(`/realm/${node.realmId}/node${nodePath}/${field.key}/${node.id}`)
            }>
            <Link href={`/realm/${node.realmId}/node${nodePath}/${field.key}/${node.id}`}>
              {node.schema?.name}
            </Link>

            <Button shape="circle" type="link" onClick={() => removeOption(index)}>
              <MinusCircleOutlined />
            </Button>
          </List.Item>
        ))}
      </List>

      {canAddMore && (
        <Dropdown.Button overlay={menu} icon={<PlusOutlined />}>
          <Select
            value={null}
            showSearch
            placeholder="Add node"
            filterOption={(input, option) =>
              option.title?.toLowerCase().includes(input.toLowerCase())
            }
            showArrow={false}
            onChange={addNewNode}>
            {viewSchemas.map((item) => (
              <Select.Option key={item.id} value={item.id} title={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Dropdown.Button>
      )}
    </Container>
  )
}

export function ViewDataForm({ node, field }: FieldDataFormProps<ViewConfig>) {
  const rules: Rule[] = []
  //[{ required: field.config.required }]

  return (
    <Form.Item label={field.name} name={field.key} rules={rules} help={field.description || null}>
      <ViewsList node={node} field={field} />
    </Form.Item>
  )
}

// Style

const Container = styled.div`
  overflow: hidden;
  border-radius: 6px 6px 0 0;

  .ant-dropdown-button {
    width: 100%;

    .ant-btn:first-of-type {
      width: 100%;
      padding: 0;
      border: none;
    }
  }

  .nodes {
    padding: 0 24px;
    border: 1px solid #f0f0f0;

    &,
    .ant-list {
    }

    .ant-list-item {
      padding: 12px 24px;
      margin: 0 -25px;

      &.active {
        background: ${Color.Primary};
        color: white;
      }
    }
  }
`
