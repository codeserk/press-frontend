import { CreateNodeRequest, NodeEntity, NodeEntityTypeEnum, UpdateNodeRequest } from 'client'
import { useRouter } from 'next/router'
import { createContext, useEffect, useMemo, useState } from 'react'

import { nodeAPI } from '../api/clients'
import { RealmStore } from './realm.store'
import { SchemaStore } from './schema.store'

export function useNodeStore(realm: RealmStore, schema: SchemaStore) {
  const router = useRouter()
  const path = (router.query.path as string[]) ?? []

  // State
  const [nodesMap, setNodes] = useState<Record<string, NodeEntity>>({})

  // Getters
  const nodes = useMemo(() => Object.values(nodesMap), [nodesMap])
  function nodeById(id: string): NodeEntity | undefined {
    return nodesMap[id]
  }

  const scenes = useMemo(() => nodes.filter((node) => node.type === NodeEntityTypeEnum.Scene), [
    nodes,
  ])
  const currentNodeId = useMemo(() => {
    if (!path.length) {
      return
    }

    return path[path.length - 1]
  }, [router.query.path])
  const currentNode = useMemo(() => nodesMap[currentNodeId], [nodesMap, currentNodeId])
  const currentSchema = useMemo(() => {
    if (!currentNode) {
      return
    }

    return schema.schemaById(currentNode.schemaId)
  }, [currentNode, schema.schemas])
  const pathNodes = useMemo(() => {
    const result = []
    let uri = ''
    for (let i = 0; i < path.length; i += 2) {
      const id = path[i]
      const node = nodesMap[id]
      const key = path[i - 1]
      const prevId = path[i - 2]
      const prevNode = nodesMap[prevId]
      let label = node?.name

      if (key && prevNode) {
        const schemaId = prevNode.schemaId
        const nodeSchema = schema.schemaById(schemaId)
        const field = nodeSchema.fields?.find((item) => item.key === key)
        if (field) {
          label = field.name
        }
      }

      uri += '/' + [key, id].filter(Boolean).join('/')

      result.push({ id, node, key, label, uri })
    }

    return result
  }, [path])

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

  function addLocalNode(params: Omit<NodeEntity, 'id'>): NodeEntity {
    const node = {
      id: `new:${(Math.random() * 100000).toFixed(0)}`,
      ...params,
    }
    addNode(node)

    return node
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
    nodeById,
    pathNodes,

    nodes,
    scenes,
    currentNodeId,
    currentNode,
    currentSchema,

    addLocalNode,
    createNode,
    updateNode,
  }
}

export type NodeStore = ReturnType<typeof useNodeStore>

export const NodeStoreContext = createContext<NodeStore>(null)
