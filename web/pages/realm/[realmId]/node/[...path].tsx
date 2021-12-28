import { Card } from 'antd'
import { NodeStoreContext } from 'core/modules/nodes/node.store'
import { useContext, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { NodeDrawer } from '../../../../src/components/node/NodeDrawer'
import { NodeForm } from '../../../../src/components/node/NodeForm'

export default function NodePage() {
  const { pathNodes } = useContext(NodeStoreContext)

  const $container = useRef<HTMLDivElement>()
  const validPathNodes = useMemo(() => pathNodes.filter((item) => !!item.node), [pathNodes])

  useEffect(() => {
    $container.current?.scrollTo({ left: $container.current.scrollWidth, behavior: 'smooth' })
  }, [pathNodes])

  return (
    <Container ref={$container} className="NodePage">
      {validPathNodes.map((item) => (
        <Card key={item.id}>
          <NodeForm node={item.node} />
        </Card>
      ))}

      <NodeDrawer />
    </Container>
  )
}

// Styles

const Container = styled.div`
  margin: -24px -48px -48px -48px;
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  /* width: 400px; */

  > .ant-card {
    min-width: 400px;
    scroll-snap-align: start;
  }
`
