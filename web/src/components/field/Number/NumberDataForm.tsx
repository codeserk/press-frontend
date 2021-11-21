import { Form, InputNumber, Slider } from 'antd'
import { Rule } from 'rc-field-form/lib/interface'
import { useMemo } from 'react'
import styled from 'styled-components'

import { FieldDataFormProps } from '../FieldDataForm'

interface NumberConfig {
  required?: boolean
  min?: number
  max?: number
  slider?: boolean
}

export function NumberDataForm({ field }: FieldDataFormProps<NumberConfig>) {
  const rules: Rule[] = [
    { required: field.config.required },
    { type: 'number', min: field.config.min },
    { type: 'number', max: field.config.max },
  ]

  const Input = useMemo(() => (field.config.slider ? Slider : InputNumber), [field.config.slider])

  return (
    <FormItem label={field.name} name={field.key} rules={rules} help={field.description || null}>
      <Input
        placeholder={field.description || field.name}
        min={field.config.min}
        max={field.config.max}
      />
    </FormItem>
  )
}

const FormItem = styled(Form.Item)`
  .ant-input-number {
    width: 100%;
  }
`
