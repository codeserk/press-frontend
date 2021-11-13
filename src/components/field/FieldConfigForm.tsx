import { Button, Divider, Form, Input, Space } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { useRouter } from 'next/router'
import { FC, useContext, useState } from 'react'

import { FieldEntity } from '../../../client'
import { PRIMITIVES_LIST, PrimitiveType } from '../../interfaces/primitive.interface'
import { RealmStoreContext } from '../../store/realm.store'
import { SchemaStoreContext } from '../../store/schema.store'
import { BooleanConfigForm } from './Boolean/BooleanConfigForm'
import { DateConfigForm } from './Date/DateConfigForm'
import { NodeConfigForm } from './Node/NodeConfigForm'
import { NumberConfigForm } from './Number/NumberConfigForm'
import { OptionsConfigForm } from './Options/OptionsConfigForm'
import { TextConfigForm } from './Text/TextConfigForm'

function PrimitiveButton({ icon, name, onClick, active = false }) {
  const type = active ? 'primary' : 'text'

  return (
    <Button
      className={`PrimitiveButton ${active ? 'active' : ''}`}
      icon={icon}
      type={type}
      onClick={onClick}>
      {name}
    </Button>
  )
}

function PrimitiveSelector({ type, onChange }) {
  return (
    <div className="PrimitiveSelector">
      <Space size={[8, 8]} align="center" wrap>
        {PRIMITIVES_LIST.map((primitive, index) => (
          <PrimitiveButton
            key={index}
            icon={primitive.icon}
            name={primitive.label}
            active={type === primitive.type}
            onClick={() => onChange(primitive.type)}
          />
        ))}
      </Space>
    </div>
  )
}

const PRIMITIVE_FORM_COMPONENT: Record<PrimitiveType, FC<any>> = {
  [PrimitiveType.Text]: TextConfigForm,
  [PrimitiveType.Boolean]: BooleanConfigForm,
  [PrimitiveType.Number]: NumberConfigForm,
  [PrimitiveType.Date]: DateConfigForm,
  [PrimitiveType.Options]: OptionsConfigForm,
  [PrimitiveType.Node]: NodeConfigForm,
}

interface FieldConfigFormProps {
  field: FieldEntity
}

export function FieldConfigForm({ field }: FieldConfigFormProps) {
  const config = field.config
  const router = useRouter()

  const [primitive, setPrimitive] = useState(field.primitive)
  const { currentRealm } = useContext(RealmStoreContext)
  const { currentSchema, updateField, deleteField } = useContext(SchemaStoreContext)

  const PrimitiveComponent = PRIMITIVE_FORM_COMPONENT[primitive] ?? PRIMITIVE_FORM_COMPONENT.text

  function onSubmit(params) {
    const { name, description, ...config } = params
    updateField(currentRealm.id, currentSchema.id, field.id, {
      name,
      description,
      primitive,
      config,
    })
  }

  async function onDelete(fieldId: string) {
    await deleteField(currentRealm.id, currentSchema.id, fieldId)

    router.push(`/realm/${currentRealm.id}/schema/${currentSchema.id}`)
  }

  return (
    <div className="FieldConfigForm">
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
        layout="horizontal"
        initialValues={{ ...field, ...field.config, key: field.key }}
        onFinish={onSubmit}>
        <Divider type="horizontal" orientation="left">
          Type
        </Divider>
        <PrimitiveSelector type={primitive} onChange={setPrimitive} />

        <Divider type="horizontal" orientation="left">
          Config
        </Divider>
        <PrimitiveComponent config={config} />

        <Divider type="horizontal" orientation="left">
          Visual
        </Divider>
        <Form.Item label="Display Name" name="name">
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>

        <Divider type="horizontal" orientation="left" className="danger">
          Danger zone
        </Divider>

        <Form.Item wrapperCol={{ offset: 4, span: 4 }}>
          <Button danger onClick={() => onDelete(field.id)}>
            Delete field
          </Button>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form>
    </div>
  )
}
