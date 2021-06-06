import { FC } from 'react'

import { FieldEntity } from '../../interfaces/field.interface'
import { PrimitiveType } from '../../interfaces/primitive.interface'
import { BooleanDataForm } from './Boolean/BooleanDataForm'
import { DateDataForm } from './Date/DateDataForm'
import { NumberDataForm } from './Number/NumberDataForm'
import { OptionsDataForm } from './Options/OptionsDataForm'
import { TextDataForm } from './Text/TextDataForm'

const PRIMITIVE_FORM_COMPONENT: Record<PrimitiveType, FC<FieldDataFormProps>> = {
  [PrimitiveType.Text]: TextDataForm,
  [PrimitiveType.Boolean]: BooleanDataForm,
  [PrimitiveType.Number]: NumberDataForm,
  [PrimitiveType.Date]: DateDataForm,
  [PrimitiveType.Options]: OptionsDataForm,
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
