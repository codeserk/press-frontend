import { Form, InputNumber, Switch } from 'antd'

export function TextConfigForm({ config, onConfigChanged }) {
  return (
    <div className="TextPrimitive">
      <Form.Item
        label="Required"
        name="required"
        valuePropName="checked"
        help="Whether the field is required or not">
        <Switch />
      </Form.Item>

      <Form.Item label="Min characters" name="minChars">
        <InputNumber />
      </Form.Item>

      <Form.Item label="Max characters" name="maxChars">
        <InputNumber />
      </Form.Item>
    </div>
  )
}
