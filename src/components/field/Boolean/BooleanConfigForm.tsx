import { Form, Switch } from 'antd'

export function BooleanConfigForm() {
  return (
    <div className="BooleanPrimitive">
      <Form.Item
        label="Required"
        name="required"
        valuePropName="checked"
        help="Whether the field is required or not">
        <Switch />
      </Form.Item>
    </div>
  )
}
