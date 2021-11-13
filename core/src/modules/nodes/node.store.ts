import { createContext, useEffect, useMemo, useReducer } from 'react'

import { api } from '../../api/clients'
import { CreateNodeRequest, NodeEntity, NodeEntityTypeEnum, UpdateNodeRequest } from '../../client'
import { Route } from '../../interfaces/route.interface'
import { EntityReducer, entityReducer } from '../../utils/store'
import { RealmStore } from '../realms/realm.store'
import { SchemaStore } from '../schemas/schema.store'

export function useNodeStore(route: Route, realm: RealmStore, schema: SchemaStore) {
  const path = route.path ?? []

  // State
  const [nodesMap, dispatchNodes] = useReducer(
    entityReducer as EntityReducer<string, NodeEntity>,
    {},
  )

  // Getters
  const nodes = useMemo(() => Object.values(nodesMap), [nodesMap])
  function nodeById(id: string): NodeEntity | undefined {
    return nodesMap[id]
  }

  const scenes = useMemo(
    () => nodes.filter((node) => node.type === NodeEntityTypeEnum.Scene),
    [nodes],
  )
  const currentNodeId = useMemo(() => {
    if (!path.length) {
      return
    }

    return path[path.length - 1]
  }, [path])
  const currentNode = useMemo(() => {
    if (!currentNodeId) {
      return
    }

    return nodesMap[currentNodeId]
  }, [nodesMap, currentNodeId])
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
        const field = nodeSchema?.fields?.find((item) => item.key === key)
        if (field) {
          label = field.name
        }
      }

      uri += '/' + [key, id].filter(Boolean).join('/')

      result.push({ id, node, key, label, uri })
    }

    return result
  }, [path])

  // Actions
  async function loadNodes() {
    const response = await api.nodes.getNodes({ realmId: realm.currentRealmId })

    dispatchNodes({ type: 'addMany', items: response.data })
  }

  function addLocalNode(params: Omit<NodeEntity, 'id'>): NodeEntity {
    const node = {
      id: `new:${(Math.random() * 100000).toFixed(0)}`,
      ...params,
    }
    dispatchNodes({ type: 'addOne', item: node })

    return node
  }

  async function createNode(realmId: string, params: CreateNodeRequest) {
    const response = await api.nodes.createNode({ realmId, body: params })

    dispatchNodes({ type: 'addOne', item: response.data })
  }

  async function updateNode(realmId: string, nodeId: string, params: UpdateNodeRequest) {
    const response = await api.nodes.updateNode({ realmId, nodeId, body: params })

    dispatchNodes({ type: 'addOne', item: response.data })
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
