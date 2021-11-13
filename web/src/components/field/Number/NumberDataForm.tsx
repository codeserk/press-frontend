import { Form, InputNumber } from 'antd'
import { Rule } from 'rc-field-form/lib/interface'

import { FieldDataFormProps } from '../FieldDataForm'

interface NumberConfig {
  required?: boolean
  min?: number
  max?: number
}

export function NumberDataForm({ field }: FieldDataFormProps<NumberConfig>) {
  const rules: Rule[] = [
    { required: field.config.required },
    { type: 'number', min: field.config.min },
    { type: 'number', max: field.config.max },
  ]

  return (
    <Form.Item label={field.name} name={field.key} rules={rules} help={field.description || null}>
      <InputNumber placeholder={field.description || field.name} />
    </Form.Item>
  )
}
