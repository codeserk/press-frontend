import { CreateNodeRequest, NodeEntity, NodeEntityTypeEnum, UpdateNodeRequest } from 'client'
import { useRouter } from 'next/router'
import { createContext, useEffect, useMemo, useState } from 'react'

import { nodeAPI } from '../api/clients'
import { RealmStore } from './realm.store'
import { SchemaStore } from './schema.store'

export function useNodeStore(realm: RealmStore, schema: SchemaStore) {
  const router = useRouter()

  // State
  const [nodesMap, setNodes] = useState<Record<string, NodeEntity>>({})

  // Getters
  const nodes = useMemo(() => Object.values(nodesMap), [nodesMap])
  const scenes = useMemo(() => nodes.filter((node) => node.type === NodeEntityTypeEnum.Scene), [
    nodes,
  ])
  const currentNodeId = useMemo(() => router.query.nodeId as string, [router.query.nodeId])
  const currentNode = useMemo(() => nodesMap[currentNodeId], [nodesMap, currentNodeId])
  const currentSchema = useMemo(() => {
    if (!currentNode) {
      return
    }

    return schema.schemaById(currentNode.schemaId)
  }, [currentNode, schema.schemas])

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

    addNode(newNode)
  }

  async function updateNode(realmId: string, nodeId: string, params: UpdateNodeRequest) {
    const response = await nodeAPI.updateNode({ realmId, nodeId, body: params })
    const node = response.data

    addNode(node)
  }

  useEffect(() => {
    if (realm.currentRealm) {
      loadNodes()
    }
  }, [realm.currentRealm])

  return {
    nodes,
    scenes,
    currentNodeId,
    currentNode,
    currentSchema,

    createNode,
    updateNode,
  }
}

export type NodeStore = ReturnType<typeof useNodeStore>

export const NodeStoreContext = createContext<NodeStore>(null)
