import {
  CalendarOutlined,
  CheckSquareOutlined,
  FileImageOutlined,
  FontColorsOutlined,
  LinkOutlined,
  NumberOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import { Button, Divider, Form, Space } from 'antd'
import { FC, useContext, useState } from 'react'

import { FieldEntity } from '../../../client'
import { PrimitiveType } from '../../interfaces/primitive.interface'
import { RealmStoreContext } from '../../store/realm.store'
import { SchemaStoreContext } from '../../store/schema.store'
import { BooleanConfigForm } from './Boolean/BooleanConfigForm'
import { TextConfigForm } from './Text/TextConfigForm'

interface PrimitiveInfo {
  icon: any
  type: string
  label: string
}

const PRIMITIVES: PrimitiveInfo[] = [
  { icon: <FontColorsOutlined />, type: 'text', label: 'Text' },
  { icon: <CheckSquareOutlined />, type: 'boolean', label: 'Boolean' },
  { icon: <NumberOutlined />, type: 'number', label: 'Number' },
  { icon: <CalendarOutlined />, type: 'other', label: 'Date/Time' },
  { icon: <TagsOutlined />, type: 'other', label: 'Options' },
  { icon: <FileImageOutlined />, type: 'other', label: 'Media' },
  { icon: <LinkOutlined />, type: 'other', label: 'Link' },
]

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
        {PRIMITIVES.map((primitive, index) => (
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
}

interface FieldConfigFormProps {
  field: FieldEntity
}

export function FieldConfigForm({ field }: FieldConfigFormProps) {
  const config = field.config

  const [primitive, setPrimitive] = useState(field.primitive)
  const { currentRealm } = useContext(RealmStoreContext)
  const { currentSchema, updateField } = useContext(SchemaStoreContext)

  const PrimitiveComponent = PRIMITIVE_FORM_COMPONENT[primitive] ?? PRIMITIVE_FORM_COMPONENT.text

  function onSubmit(params) {
    updateField(currentRealm.id, currentSchema.id, field.id, {
      primitive,
      config: params,
    })
  }

  return (
    <div className="FieldConfigForm">
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        initialValues={{ ...field.config, key: field.key }}
        onFinish={onSubmit}>
        <Divider type="horizontal" orientation="left">
          Type
        </Divider>
        <PrimitiveSelector type={primitive} onChange={setPrimitive} />

        <Divider type="horizontal" orientation="left">
          Config
        </Divider>
        <PrimitiveComponent config={config} />

        <Divider type="horizontal" orientation="left" className="danger">
          Danger zone
        </Divider>

        <Form.Item wrapperCol={{ offset: 4, span: 4 }}>
          <Button danger>Delete field</Button>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form>
    </div>
  )
}
