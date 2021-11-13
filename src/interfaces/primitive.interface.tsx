import {
  CalendarOutlined,
  CheckSquareOutlined,
  FontColorsOutlined,
  NodeIndexOutlined,
  NumberOutlined,
  TagsOutlined,
} from '@ant-design/icons'

export enum PrimitiveType {
  Text = 'text',
  Boolean = 'boolean',
  Number = 'number',
  Date = 'date',
  Options = 'options',
  Node = 'node',
}

interface PrimitiveInfo {
  icon: any
  type: string
  label: string
}

export const PRIMITIVES: Record<PrimitiveType, PrimitiveInfo> = {
  [PrimitiveType.Text]: { icon: <FontColorsOutlined />, type: 'text', label: 'Text' },
  [PrimitiveType.Boolean]: { icon: <CheckSquareOutlined />, type: 'boolean', label: 'Boolean' },
  [PrimitiveType.Number]: { icon: <NumberOutlined />, type: 'number', label: 'Number' },
  [PrimitiveType.Date]: { icon: <CalendarOutlined />, type: 'date', label: 'Date/Time' },
  [PrimitiveType.Options]: { icon: <TagsOutlined />, type: 'options', label: 'Options' },
  [PrimitiveType.Node]: { icon: <NodeIndexOutlined />, type: 'node', label: 'Node' },

  // Add when they are implemented in the BE
  // { icon: <FileImageOutlined />, type: 'other', label: 'Media' },
  // { icon: <LinkOutlined />, type: 'other', label: 'Link' },
}

export const PRIMITIVES_LIST = Object.values(PRIMITIVES)
