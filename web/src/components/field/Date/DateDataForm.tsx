import { DatePicker, Form } from 'antd'
import moment from 'moment'
import { Rule } from 'rc-field-form/lib/interface'
import styled from 'styled-components'

import { FieldDataFormProps } from '../FieldDataForm'

interface DateConfig {
  required?: boolean
  type: 'date' | 'time' | 'dateTime'
}

export function DateDataForm({ field }: FieldDataFormProps<DateConfig>) {
  const rules: Rule[] = [{ required: field.config.required }]

  return (
    <FormItem
      label={field.name}
      name={field.key}
      rules={rules}
      help={field.description || null}
      getValueProps={(value) => ({ value: value ? moment(value) : '' })}>
      <DatePicker
        allowClear={!field.config.required}
        showTime={field.config.type === 'dateTime'}
        picker={field.config.type === 'time' ? 'time' : 'date'}
      />
    </FormItem>
  )
}

const FormItem = styled(Form.Item)`
  .ant-picker {
    width: 100%;
  }
`
