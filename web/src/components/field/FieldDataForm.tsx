import { FieldEntity } from 'core/modules/fields/field.interface'
import { Node } from 'core/modules/nodes/node.interface'
import { FC } from 'react'

import { PrimitiveType } from '../../interfaces/primitive.interface'
import { BooleanDataForm } from './Boolean/BooleanDataForm'
import { DateDataForm } from './Date/DateDataForm'
import { NodeDataForm } from './Node/NodeDataForm'
import { NumberDataForm } from './Number/NumberDataForm'
import { OptionsDataForm } from './Options/OptionsDataForm'
import { TextDataForm } from './Text/TextDataForm'
import { ViewDataForm } from './View/ViewDataForm'

const PRIMITIVE_FORM_COMPONENT: Record<PrimitiveType, FC<FieldDataFormProps>> = {
  [PrimitiveType.Text]: TextDataForm,
  [PrimitiveType.Boolean]: BooleanDataForm,
  [PrimitiveType.Number]: NumberDataForm,
  [PrimitiveType.Date]: DateDataForm,
  [PrimitiveType.Options]: OptionsDataForm,
  [PrimitiveType.Node]: NodeDataForm,
  [PrimitiveType.View]: ViewDataForm,
}

export interface FieldDataFormProps<C = any, D = any> {
  node: Node
  field: FieldEntity<C>
  data: D
}

export function FieldDataForm({ node, field, data }: FieldDataFormProps) {
  const Component = PRIMITIVE_FORM_COMPONENT[field.primitive]

  if (!Component) {
    return <></>
  }

  return <Component node={node} field={field} data={data} />
}
