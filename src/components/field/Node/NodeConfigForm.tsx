import { Form, InputNumber, Select, Switch } from 'antd'
import { useContext } from 'react'

import { SchemaStoreContext } from '../../../store/schema.store'

export function NodeConfigForm() {
  const { schemas } = useContext(SchemaStoreContext)

  return (
    <div className="TextPrimitive">
      <Form.Item
        label="Required"
        name="required"
        valuePropName="checked"
        help="Whether the field is required or not">
        <Switch />
      </Form.Item>

      <Form.Item label="Min nodes" name="min">
        <InputNumber />
      </Form.Item>

      <Form.Item label="Max nodes" name="max">
        <InputNumber />
      </Form.Item>

      <Form.Item label="Schemas" name="schemas">
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          defaultValue={[]}>
          {schemas.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  )
}
