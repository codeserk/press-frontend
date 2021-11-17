import { NodeEntity } from '../../client'

export interface Node extends NodeEntity {
  /** Whether the node is a new one, not created yet */
  isNew?: boolean
}
