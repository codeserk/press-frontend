import Title from 'antd/lib/typography/Title'
import { useContext } from 'react'

import { NodeStoreContext } from '../../../../../src/store/node.store'

export default function NodePage() {
  const { currentNode } = useContext(NodeStoreContext)

  if (!currentNode) {
    return <></>
  }

  return (
    <div className="NodePage">
      <Title>{currentNode.name}</Title>
    </div>
  )
}
