import { Form, Radio, Switch } from 'antd'

const TYPE_OPTIONS = [
  { label: 'Date', value: 'date' },
  { label: 'Time', value: 'time' },
  { label: 'Date and Time', value: 'dateTime' },
]

export function DateConfigForm() {
  return (
    <div className="DatePrimitive">
      <Form.Item
        label="Required"
        name="required"
        valuePropName="checked"
        help="Whether the field is required or not">
        <Switch />
      </Form.Item>

      <Form.Item label="Type of calendar" name="type" help="Select the type of calendar">
        <Radio.Group options={TYPE_OPTIONS} optionType="button" buttonStyle="solid" />
      </Form.Item>
    </div>
  )
}
