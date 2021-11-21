import { FieldEntity as ClientFieldEntity } from '../../client'

// eslint-disable-next-line @typescript-eslint/ban-types
export interface FieldEntity<T extends Record<string, any> = any> extends ClientFieldEntity {
  placeholder?: string
  config: T
}
