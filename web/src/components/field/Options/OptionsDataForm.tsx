import { Form, Select } from 'antd'
import { Rule } from 'rc-field-form/lib/interface'

import { FieldDataFormProps } from '../FieldDataForm'

interface Option {
  value: string
  label: string
}

interface OptionsConfig {
  required?: boolean
  multiple?: boolean
  options: Option[]
}

export function OptionsDataForm({ field }: FieldDataFormProps<OptionsConfig>) {
  const rules: Rule[] = [{ required: field.config.required }]

  return (
    <Form.Item label={field.name} name={field.key} rules={rules} help={field.description || null}>
      <Select
        allowClear={!field.config.required}
        mode={field.config.multiple ? 'multiple' : undefined}
        placeholder={field.description || field.name}>
        {field.config.options?.map((option, index) => (
          <Select.Option key={index} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  )
}
