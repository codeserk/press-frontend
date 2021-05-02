import Title from 'antd/lib/typography/Title'
import { useContext } from 'react'

import { FieldConfigForm } from '../../../../../../src/components/field/FieldConfigForm'
import { SchemaStoreContext } from '../../../../../../src/store/schema.store'

export default function FieldPage() {
  const { currentField } = useContext(SchemaStoreContext)

  if (!currentField) {
    return <></>
  }

  console.log(currentField)

  return (
    <div className="FieldPage">
      <Title>{currentField.name}</Title>

      <FieldConfigForm field={currentField} />
    </div>
  )
}
