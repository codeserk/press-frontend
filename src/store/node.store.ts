import { CreateNodeRequest, FieldEntity, NodeEntity, SchemaEntity } from 'client'
import { useRouter } from 'next/router'
import { createContext, useEffect, useMemo, useState } from 'react'

import { fieldAPI, nodeAPI, schemaAPI } from '../api/clients'
import { RealmStore } from './realm.store'

export function useNodeStore(realm: RealmStore) {
  const router = useRouter()

  // State
  const [nodesMap, setNodes] = useState<Record<string, NodeEntity>>({})

  // Getters
  const nodes = useMemo(() => Object.values(nodesMap), [nodesMap])
  const currentNodeId = useMemo(() => router.query.nodeId as string, [router.query.nodeId])
  const currentNode = useMemo(() => nodesMap[currentNodeId], [nodesMap, currentNodeId])

  // Mutations
  function addNode(node: NodeEntity) {
    const nodes = { ...nodesMap }
    nodes[node.id] = node
    setNodes(nodes)
  }

  // Actions
  async function loadNodes() {
    const response = await nodeAPI.getNodes({ realmId: realm.currentRealmId })
    const nodesById: Record<string, NodeEntity> = {}
    for (const node of response.data) {
      nodesById[node.id] = node
    }

    setNodes(nodesById)
  }

  async function createNode(realmId: string, params: CreateNodeRequest) {
    const response = await nodeAPI.createNode({ realmId, body: params })
    const newNode = response.data

    console.log(newNode)
    addNode(newNode)
  }

  useEffect(() => {
    if (realm.currentRealm) {
      loadNodes()
    }
  }, [realm.currentRealm])

  return {
    nodes,
    currentNodeId,
    currentNode,

    createNode,
  }
}

export type NodeStore = ReturnType<typeof useNodeStore>

export const NodeStoreContext = createContext<NodeStore>(null)
