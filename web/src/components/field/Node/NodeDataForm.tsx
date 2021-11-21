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

interface NodeConfig {
  required?: boolean
}

type NodeWithSchema = Node & { schema?: SchemaEntity }

function NodesList({ node, field, value, onChange }) {
  const router = useRouter()

  const { currentRealmId } = useContext(RealmStoreContext)
  const { modelSchemas, schemaById } = useContext(SchemaStoreContext)
  const {
    scenesBySchema,
    modelsBySchema,
    pathNodes,
    pathNodeIds,
    pathForNode,
    addLocalNode,
    nodeById,
    nodes,
  } = useContext(NodeStoreContext)

  const nodePath = useMemo(() => pathForNode(node.id), [pathNodes, node])
  const nodeIds = Array.isArray(value) ? value : []
  const populatedNodes = useMemo(
    () =>
      (Array.isArray(value) ? value : [])
        .map((id) => {
          const node: NodeWithSchema = nodeById(id)
          if (!node) {
            return
          }
          node.schema = schemaById(node.schemaId)

          return node
        })
        .filter(Boolean),
    [value, nodes, modelSchemas],
  )

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

    onChange && onChange(newNodes)
  }

  function addExistingNode(id: string) {
    const newNodes = [...nodeIds, id]

    onChange && onChange(newNodes)
  }

  function removeOption(index: number) {
    const newOptions = [...nodeIds]
    newOptions.splice(index, 1)

    onChange && onChange(newOptions)
  }

  const menu = useMemo(
    () => (
      <Menu>
        {modelSchemas.map((schema) => (
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

      {/* {populatedNodes.map((node, index) => {
        return (
          <Form.Item key={index}>
            <Input.Group compact style={{ display: 'flex' }}>
              <Link href={`/realm/${node.realmId}/node${nodePath}/${field.key}/${node.id}`}>
                <Button block>{node.schema?.name}</Button>
              </Link>
              <Form.Item noStyle>
                <Button shape="circle" type="link" onClick={() => removeOption(index)}>
                  <MinusCircleOutlined />
                </Button>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        )
      })} */}

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
            onChange={addExistingNode}>
            {scenesBySchema.map((item) => (
              <Select.OptGroup label={`Scene: ${item.schema.name}`} key={item.schema.id}>
                {item.nodes.map((node) => (
                  <Select.Option key={node.id} value={node.id} title={node.name}>
                    {node.name}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            ))}
            {modelsBySchema.map((item) => (
              <Select.OptGroup label={`Model: ${item.schema.name}`} key={item.schema.id}>
                {item.nodes.map((node) => (
                  <Select.Option key={node.id} value={node.id} title={node.name}>
                    {node.name}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            ))}
          </Select>
        </Dropdown.Button>
      )}
    </Container>
  )
}

export function NodeDataForm({ node, field }: FieldDataFormProps<NodeConfig>) {
  const rules: Rule[] = []
  //[{ required: field.config.required }]

  return (
    <Form.Item label={field.name} name={field.key} rules={rules} help={field.description || null}>
      <NodesList node={node} field={field} />
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
