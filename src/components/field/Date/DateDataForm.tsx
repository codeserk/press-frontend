import { DatePicker, Form } from 'antd'
import moment from 'moment'
import { Rule } from 'rc-field-form/lib/interface'

import { FieldDataFormProps } from '../FieldDataForm'

interface DateConfig {
  required?: boolean
  type: 'date' | 'time' | 'dateTime'
}

export function DateDataForm({ field }: FieldDataFormProps<DateConfig>) {
  const rules: Rule[] = [{ required: field.config.required }]

  return (
    <Form.Item
      label={field.name}
      name={field.key}
      rules={rules}
      help={field.description || null}
      getValueProps={(value) => ({ value: moment(value) })}>
      <DatePicker
        showTime={field.config.type === 'dateTime'}
        picker={field.config.type === 'time' ? 'time' : 'date'}
      />
    </Form.Item>
  )
}
