import { Form, InputNumber, Radio, Switch } from 'antd'

export function TextConfigForm() {
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

      <Form.Item label="Type" name="type">
        <Radio.Group>
          <Radio.Button value="text">Text</Radio.Button>
          <Radio.Button value="textarea">Textarea</Radio.Button>
          <Radio.Button value="richtext">Rich text</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </div>
  )
}
