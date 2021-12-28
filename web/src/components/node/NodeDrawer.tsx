import { Drawer } from 'antd'
import { NodeStoreContext } from 'core/modules/nodes/node.store'
import { FC, useContext, useMemo } from 'react'
import styled from 'styled-components'

import { NodeForm } from './NodeForm'

export const NodeDrawer: FC = () => {
  const { pathNodes } = useContext(NodeStoreContext)

  const validPathNodes = useMemo(() => pathNodes.filter((item) => !!item.node), [pathNodes])

  return (
    <Container visible width={400} mask={false}>
      <div className="nodes">
        {validPathNodes.map((item) => (
          <div key={item.id}>
            <NodeForm node={item.node} />
          </div>
        ))}
      </div>
    </Container>
  )
}

// Styles

const Container = styled(Drawer)`
  .ant-drawer-body {
    padding: 0;
  }

  .nodes {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    height: 100%;
    > div {
      padding: 24px;
      min-width: 400px;
      height: 100%;
      scroll-snap-align: start;
    }
  }
`
