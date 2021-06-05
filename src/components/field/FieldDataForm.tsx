import { FC } from 'react'

import { FieldEntity } from '../../interfaces/field.interface'
import { PrimitiveType } from '../../interfaces/primitive.interface'
import { TextDataForm } from './Text/TextDataForm'

const PRIMITIVE_FORM_COMPONENT: Record<PrimitiveType, FC<FieldDataFormProps>> = {
  [PrimitiveType.Text]: TextDataForm,
}

export interface FieldDataFormProps<C = any, D = any> {
  field: FieldEntity<C>
  data: D
}

export function FieldDataForm({ field, data }: FieldDataFormProps) {
  const Component = PRIMITIVE_FORM_COMPONENT[field.primitive]

  if (!Component) {
    return <></>
  }

  return <Component field={field} data={data} />
}