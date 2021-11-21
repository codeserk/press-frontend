import { Button, Divider, Form, Input, Space } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { FieldEntity } from 'core/client'
import { RealmStoreContext } from 'core/modules/realms/realm.store'
import { SchemaStoreContext } from 'core/modules/schemas/schema.store'
import { useRouter } from 'next/router'
import { FC, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'

import { PRIMITIVES_LIST, PrimitiveType } from '../../interfaces/primitive.interface'
import { BooleanConfigForm } from './Boolean/BooleanConfigForm'
import { DateConfigForm } from './Date/DateConfigForm'
import { FieldDataForm } from './FieldDataForm'
import { NodeConfigForm } from './Node/NodeConfigForm'
import { NumberConfigForm } from './Number/NumberConfigForm'
import { OptionsConfigForm } from './Options/OptionsConfigForm'
import { TextConfigForm } from './Text/TextConfigForm'
import { ViewConfigForm } from './View/ViewConfigForm'

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
    <PrimitiveSelectorContainer>
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
    </PrimitiveSelectorContainer>
  )
}

const PrimitiveSelectorContainer = styled.div`
  width: 100%;
  .ant-space {
    justify-content: center;
    width: 100%;
  }

  .PrimitiveButton {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 80px;
    height: 80px;

    .anticon {
      display: block;

      svg {
        width: 24px;
        height: 24px;
      }
    }

    span {
      margin-left: 0;
    }
  }
`

const PRIMITIVE_FORM_COMPONENT: Record<PrimitiveType, FC<any>> = {
  [PrimitiveType.Text]: TextConfigForm,
  [PrimitiveType.Boolean]: BooleanConfigForm,
  [PrimitiveType.Number]: NumberConfigForm,
  [PrimitiveType.Date]: DateConfigForm,
  [PrimitiveType.Options]: OptionsConfigForm,
  [PrimitiveType.Node]: NodeConfigForm,
  [PrimitiveType.View]: ViewConfigForm,
}

interface FieldConfigFormProps {
  field: FieldEntity
}

export function FieldConfigForm({ field }: FieldConfigFormProps) {
  const config = field.config
  const router = useRouter()

  const [values, setValues] = useState(field)
  const [primitive, setPrimitive] = useState(field.primitive)
  const { currentRealm } = useContext(RealmStoreContext)
  const { currentSchema, updateField, deleteField } = useContext(SchemaStoreContext)

  const PrimitiveComponent = PRIMITIVE_FORM_COMPONENT[primitive] ?? PRIMITIVE_FORM_COMPONENT.text

  const normalizedValues = useMemo(() => {
    const { name, placeholder, description, ...config } = values

    return {
      name,
      placeholder,
      description,
      primitive,
      config,
    }
  }, [values, primitive])

  function onSubmit(params) {
    const { name, placeholder, description, ...config } = params
    updateField(currentRealm.id, currentSchema.id, field.id, {
      ...field,
      name,
      placeholder,
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
      <Preview layout="vertical" size="large" colon={false}>
        <Divider type="horizontal" orientation="left">
          Preview
        </Divider>
        <FieldDataForm node={{}} field={{ ...normalizedValues, key: 'test' }} />
      </Preview>

      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        initialValues={{ ...field, ...field.config, key: field.key }}
        onValuesChange={(value, values) => setValues(values)}
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

        <Form.Item label="Placeholder" name="placeholder">
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

const Preview = styled(Form)`
  width: 500px;

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
