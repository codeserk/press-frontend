import { Form, InputNumber, Switch } from 'antd'

export function NumberConfigForm() {
  return (
    <div className="NumberPrimitive">
      <Form.Item
        label="Required"
        name="required"
        valuePropName="checked"
        help="Whether the field is required or not">
        <Switch />
      </Form.Item>

      <Form.Item label="Min" name="min">
        <InputNumber />
      </Form.Item>

      <Form.Item label="Max" name="max">
        <InputNumber />
      </Form.Item>
    </div>
  )
}
