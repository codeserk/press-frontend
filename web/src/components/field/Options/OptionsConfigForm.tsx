import { MinusCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, Switch } from 'antd'

function OptionsManager({ value, onChange }) {
  const options = value ?? []

  function addEmptyOption() {
    const newOptions = [...options, { value: '', label: '' }]

    onChange(newOptions)
  }

  function removeOption(index: number) {
    const newOptions = [...options]
    newOptions.splice(index, 1)

    onChange(newOptions)
  }

  return (
    <>
      {options.map((_, index) => {
        return (
          <Form.Item key={index}>
            <Input.Group compact style={{ display: 'flex' }}>
              <Form.Item
                noStyle
                label="Value"
                name={['options', index, 'value']}
                rules={[{ required: true, message: 'Value is required' }]}>
                <Input style={{ flex: 1 }} placeholder="Value" />
              </Form.Item>
              <Form.Item
                noStyle
                label="Label"
                name={['options', index, 'label']}
                rules={[{ required: true, message: 'Label is required' }]}>
                <Input style={{ flex: 1 }} placeholder="Label" />
              </Form.Item>
              <Form.Item noStyle>
                <Button shape="circle" type="link" onClick={() => removeOption(index)}>
                  <MinusCircleOutlined />
                </Button>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        )
      })}

      <Form.Item>
        <Button onClick={addEmptyOption}>Add new option</Button>
      </Form.Item>
    </>
  )
}

export function OptionsConfigForm() {
  return (
    <div className="OptionsPrimitive">
      <Form.Item
        label="Required"
        name="required"
        valuePropName="checked"
        help="Whether the field is required or not">
        <Switch />
      </Form.Item>

      <Form.Item
        label="Multiple"
        name="multiple"
        valuePropName="checked"
        help="Whether multiple options can be selected or not">
        <Switch />
      </Form.Item>

      <Form.Item label="Options" name="options">
        <OptionsManager />
      </Form.Item>
    </div>
  )
}
