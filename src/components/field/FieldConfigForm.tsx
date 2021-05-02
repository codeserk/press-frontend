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
import { TextConfigForm } from './TextConfigForm'

function PrimitiveButton({ icon, name, active = false }) {
  const type = active ? 'primary' : 'text'

  return (
    <Button className={`PrimitiveButton ${active ? 'active' : ''}`} icon={icon} type={type}>
      {name}
    </Button>
  )
}

function PrimitiveSelector({ type }) {
  return (
    <div className="PrimitiveSelector">
      <Space size={[8, 8]} align="center" wrap>
        <PrimitiveButton icon={<FontColorsOutlined />} name="Text" active={type === 'text'} />
        <PrimitiveButton
          icon={<CheckSquareOutlined />}
          name="Boolean"
          active={type === 'boolean'}
        />
        <PrimitiveButton icon={<NumberOutlined />} name="Number" active={type === 'number'} />
        <PrimitiveButton icon={<CalendarOutlined />} name="Date/Time" />
        <PrimitiveButton icon={<TagsOutlined />} name="Options" />
        <PrimitiveButton icon={<FileImageOutlined />} name="Media" />
        <PrimitiveButton icon={<LinkOutlined />} name="Link" />
      </Space>
    </div>
  )
}

const PRIMITIVE_FORM_COMPONENT: Record<PrimitiveType, FC<any>> = {
  [PrimitiveType.Text]: TextConfigForm,
}

interface FieldConfigFormProps {
  field: FieldEntity
}

export function FieldConfigForm({ field }: FieldConfigFormProps) {
  const primitive = field.primitive
  const config = field.config

  const PrimitiveComponent = PRIMITIVE_FORM_COMPONENT[primitive]

  const { currentRealm } = useContext(RealmStoreContext)
  const { currentSchema, updateField } = useContext(SchemaStoreContext)

  function onSubmit(params) {
    updateField(currentRealm.id, currentSchema.id, field.id, {
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
        <PrimitiveSelector type={primitive} />

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
