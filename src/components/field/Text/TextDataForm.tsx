import { Form, Input } from 'antd'
import { Rule } from 'rc-field-form/lib/interface'

import { FieldDataFormProps } from '../FieldDataForm'

interface TextConfig {
  required?: boolean
  minChars?: number
  maxChars?: number
}

export function TextDataForm({ field }: FieldDataFormProps<TextConfig>) {
  const rules: Rule[] = [
    { required: field.config.required },
    { type: 'string', min: field.config.minChars },
    { type: 'string', max: field.config.maxChars },
  ]

  return (
    <Form.Item label={field.name} name={field.key} rules={rules} help={field.description || null}>
      <Input placeholder={field.description || field.name} />
    </Form.Item>
  )
}
