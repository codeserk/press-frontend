import { Form, Input } from 'antd'
import { Rule } from 'rc-field-form/lib/interface'
import { FC } from 'react'
import styled from 'styled-components'

import { TextEditor } from '../../TextEditor'
import { FieldDataFormProps } from '../FieldDataForm'

enum TextNodeType {
  Text = 'text',
  TextArea = 'textarea',
  RichText = 'richtext',
}

interface TextConfig {
  required?: boolean
  minChars?: number
  maxChars?: number
  type: TextNodeType
}

const INPUT_TYPE: Record<TextNodeType, any> = {
  [TextNodeType.Text]: Input,
  [TextNodeType.TextArea]: Input.TextArea,
  [TextNodeType.RichText]: TextEditor,
}

export function TextDataForm({ field }: FieldDataFormProps<TextConfig>) {
  const rules: Rule[] = [
    { required: field.config.required },
    { type: 'string', min: field.config.minChars },
    { type: 'string', max: field.config.maxChars },
  ]

  return (
    <Container>
      <Form.Item label={field.name} name={field.key} rules={rules} tooltip={field.description}>
        <InputWrapper field={field} />
      </Form.Item>
    </Container>
  )
}

const InputWrapper: FC<any> = ({ field, value, onChange }) => {
  const InputType = INPUT_TYPE[field.config.type ?? TextNodeType.Text]

  return (
    <>
      <InputType value={value} onChange={onChange} placeholder={field.placeholder} />
      <LengthCounter field={field} />
    </>
  )
}

const LengthCounter: FC<any> = ({ field }) => {
  return (
    <Form.Item shouldUpdate className="length-counter">
      {(form) => (
        <span>
          {form.getFieldValue(field.key)?.length ?? 0}
          {field.config.maxChars && ` / ${field.config.maxChars}`}
        </span>
      )}
    </Form.Item>
  )
}

// Style

const Container = styled.div`
  .ant-form-item {
    position: relative;
  }

  .length-counter {
    position: absolute;
    bottom: -11px;
    height: 14px;
    font-size: 14px;
    line-height: 1.5715;
    right: 0;
  }

  .ant-form-item-has-error .length-counter {
    color: #ff4d4f;
  }
`
