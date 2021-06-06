import {
  CalendarOutlined,
  CheckSquareOutlined,
  FontColorsOutlined,
  NumberOutlined,
} from '@ant-design/icons'

export enum PrimitiveType {
  Text = 'text',
  Boolean = 'boolean',
  Number = 'number',
  Date = 'date',
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
  // Add when they are implemented in the BE
  // { icon: <TagsOutlined />, type: 'other', label: 'Options' },
  // { icon: <FileImageOutlined />, type: 'other', label: 'Media' },
  // { icon: <LinkOutlined />, type: 'other', label: 'Link' },
}

export const PRIMITIVES_LIST = Object.values(PRIMITIVES)
