import { Form, Switch } from 'antd'
import { Rule } from 'rc-field-form/lib/interface'

import { FieldDataFormProps } from '../FieldDataForm'

interface BooleanConfig {
  required?: boolean
}

export function BooleanDataForm({ field }: FieldDataFormProps<BooleanConfig>) {
  const rules: Rule[] = [{ required: field.config.required }]

  return (
    <Form.Item label={field.name} valuePropName="checked" name={field.key} rules={rules}>
      <Switch />
    </Form.Item>
  )
}
