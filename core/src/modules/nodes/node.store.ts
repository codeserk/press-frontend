import { createContext, useDebugValue, useEffect, useMemo, useReducer, useState } from 'react'

import { api } from '../../api/clients'
import {
  CreateNodeRequest,
  NodeEntityTypeEnum,
  SchemaEntity,
  UpdateNodeRequest,
} from '../../client'
import { Route } from '../../interfaces/route.interface'
import { EntityReducer, entityReducer } from '../../utils/store'
import { RealmStore } from '../realms/realm.store'
import { SchemaStore } from '../schemas/schema.store'
import { Node } from './node.interface'

export interface NodeBySchema {
  schema: SchemaEntity
  nodes: Node[]
}

export function useNodeStore(route: Route, realm: RealmStore, schema: SchemaStore) {
  const path = route.path ?? []

  // State
  const [isLoading, setLoading] = useState(false)
  const [nodesMap, dispatchNodes] = useReducer(entityReducer as EntityReducer<string, Node>, {})

  // Getters
  const nodes = useMemo(() => Object.values(nodesMap), [nodesMap])
  function nodeById(id: string): Node | undefined {
    return nodesMap[id]
  }

  const scenes = useMemo(
    () => nodes.filter((node) => node.type === NodeEntityTypeEnum.Scene),
    [nodes],
  )
  const models = useMemo(
    () => nodes.filter((node) => node.type === NodeEntityTypeEnum.Model),
    [nodes],
  )
  const scenesBySchema = useMemo(() => {
    const result: NodeBySchema[] = []
    for (const sceneSchema of schema.sceneSchemas) {
      const scenesInSchema = scenes.filter((scene) => scene.schemaId === sceneSchema.id)
      if (scenesInSchema.length > 0) {
        result.push({ schema: sceneSchema, nodes: scenesInSchema })
      }
    }

    return result
  }, [scenes, schema.sceneSchemas])

  const modelsBySchema = useMemo(() => {
    const result: NodeBySchema[] = []
    for (const modelSchema of schema.modelSchemas) {
      const modelsInSchema = models.filter((scene) => scene.schemaId === modelSchema.id)
      if (modelsInSchema.length > 0) {
        result.push({ schema: modelSchema, nodes: modelsInSchema })
      }
    }

    return result
  }, [scenes, schema.modelSchemas])

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
  }, [path, nodesMap])
  const pathNodeIds = useMemo(() => pathNodes.map((item) => item.id), [pathNodes])

  function pathForNode(id: string): string | undefined {
    for (const item of pathNodes) {
      if (item.id === id) {
        return item.uri
      }
    }

    return
  }

  // Actions
  async function loadNodes() {
    setLoading(true)

    try {
      const response = await api.nodes.getNodes({ realmId: realm.currentRealmId })

      dispatchNodes({ type: 'addMany', items: response.data })
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  function addLocalNode(params: Omit<Node, 'id'>): Node {
    const node = {
      id: `new:${(Math.random() * 100000).toFixed(0)}`,
      isNew: true,
      ...params,
    }
    dispatchNodes({ type: 'addOne', item: node })

    return node
  }

  async function saveLocalNode(id: string, params: CreateNodeRequest) {
    setLoading(true)

    try {
      const node = nodesMap[id]
      if (!node) {
        throw new Error('Missing node')
      }

      const response = await api.nodes.createNode({
        realmId: node.realmId,
        body: params,
      })

      dispatchNodes({ type: 'addOne', item: response.data })
      dispatchNodes({ type: 'addOneInId', id: node.id, item: response.data })
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  async function createNode(realmId: string, params: CreateNodeRequest) {
    setLoading(true)

    try {
      const response = await api.nodes.createNode({ realmId, body: params })

      dispatchNodes({ type: 'addOne', item: response.data })
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  async function updateNode(realmId: string, nodeId: string, params: UpdateNodeRequest) {
    setLoading(true)

    try {
      const response = await api.nodes.updateNode({ realmId, nodeId, body: params })

      dispatchNodes({ type: 'addOne', item: response.data })
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (realm.currentRealm) {
      loadNodes()
    }
  }, [realm.currentRealm])

  return {
    isLoading,
    nodeById,
    pathNodes,
    pathNodeIds,
    pathForNode,

    nodes,
    scenes,
    models,
    scenesBySchema,
    modelsBySchema,
    currentNodeId,
    currentNode,
    currentSchema,

    addLocalNode,
    saveLocalNode,
    createNode,
    updateNode,
  }
}

export type NodeStore = ReturnType<typeof useNodeStore>

export const NodeStoreContext = createContext<NodeStore>(null)
