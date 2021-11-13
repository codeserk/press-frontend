import { CreateSchemaRequest, FieldEntity, SchemaEntity } from 'client'
import { useRouter } from 'next/router'
import { createContext, useEffect, useMemo, useReducer, useState } from 'react'

import { SchemaEntityTypeEnum } from '../../client'
import { fieldAPI, schemaAPI } from '../api/clients'
import { RealmStore } from './realm.store'

type SchemaReducerAction =
  | { type: 'addOne'; newSchema: SchemaEntity }
  | { type: 'addMany'; newSchemas: Record<string, SchemaEntity> }
  | { type: 'removeOne'; id: string }

type FieldReducerAction =
  | { type: 'addOne'; newField: FieldEntity }
  | { type: 'addMany'; newFields: Record<string, FieldEntity> }
  | { type: 'removeOne'; id: string }

export function useSchemaStore(realm: RealmStore) {
  const router = useRouter()

  // State
  // Schemas dispatcher
  const [schemasMap, dispatchSchemas] = useReducer(
    (state: Record<string, SchemaEntity>, action: SchemaReducerAction) => {
      const newState = { ...state }
      switch (action.type) {
        case 'addOne':
          newState[action.newSchema.id] = action.newSchema
          break
        case 'addMany':
          for (const schema of Object.values(action.newSchemas)) {
            newState[schema.id] = schema
          }
          break
        case 'removeOne':
          delete newState[action.id]
      }
      return newState
    },
    {},
  )

  // Fields dispatcher
  const [fieldsMap, dispatchFields] = useReducer(
    (state: Record<string, FieldEntity>, action: FieldReducerAction) => {
      const newState = { ...state }
      switch (action.type) {
        case 'addOne':
          newState[action.newField.id] = action.newField
          break
        case 'addMany':
          for (const field of Object.values(action.newFields)) {
            newState[field.id] = field
          }
          break
        case 'removeOne':
          delete newState[action.id]
      }
      return newState
    },
    {},
  )

  // Getters
  const schemas = useMemo(() => Object.values(schemasMap), [schemasMap])
  const sceneSchemas = useMemo(
    () => schemas.filter((schema) => schema.type === SchemaEntityTypeEnum.Scene),
    [schemas],
  )
  const nodeSchemas = useMemo(
    () => schemas.filter((schema) => schema.type === SchemaEntityTypeEnum.Nested),
    [schemas],
  )
  const currentSchemaId = useMemo(() => router.query.schemaId as string, [router.query.schemaId])
  const currentSchema = useMemo(() => schemasMap[currentSchemaId], [schemasMap, currentSchemaId])

  const fields = useMemo(() => Object.values(fieldsMap), [fieldsMap])
  const currentFieldId = useMemo(() => router.query.fieldId as string, [router.query.fieldId])
  const currentField = useMemo(() => fieldsMap[currentFieldId], [fieldsMap, currentFieldId])

  const fieldsInSchema = (schemaId: string) => fields.filter((field) => field.schemaId === schemaId)
  const fieldsInCurrentSchema = useMemo(() => fieldsInSchema(currentSchemaId), [
    fieldsInSchema,
    currentSchemaId,
  ])

  function schemaById(id: string): SchemaEntity | undefined {
    return schemasMap[id]
  }

  // Mutations
  function addSchema(schema: SchemaEntity) {
    dispatchSchemas({ type: 'addOne', newSchema: schema })
  }

  function addField(field: FieldEntity) {
    dispatchFields({ type: 'addOne', newField: field })
  }

  function updateFieldInSchema(field: FieldEntity) {
    const schema = schemasMap[field.schemaId]
    if (!schema) {
      return
    }

    let fieldIndex = schema.fields.findIndex((schemaField) => schemaField.id === field.id)
    if (fieldIndex === -1) {
      fieldIndex = schema.fields.length
    }

    schema.fields.splice(fieldIndex, 1, field)

    addSchema(schema)
  }

  function removeFieldInSchema(field: FieldEntity) {
    const schema = schemasMap[field.schemaId]
    if (!schema) {
      return
    }

    schema.fields = schema.fields.filter((schemaField) => schemaField.id !== field.id)

    addSchema(schema)
  }

  // Actions
  async function loadSchemas() {
    const response = await schemaAPI.getSchemas({ realmId: realm.currentRealmId })

    const schemasById: Record<string, SchemaEntity> = {}
    const fieldsById: Record<string, FieldEntity> = {}
    for (const schema of response.data) {
      schemasById[schema.id] = schema

      for (const field of schema.fields) {
        fieldsById[field.id] = field
      }
    }

    dispatchSchemas({ type: 'addMany', newSchemas: schemasById })
    dispatchFields({ type: 'addMany', newFields: fieldsById })
  }

  async function createSchema(realmId: string, params: CreateSchemaRequest) {
    const response = await schemaAPI.createSchema({ realmId, body: params })
    const newSchema = response.data

    addSchema(newSchema)
  }

  async function createField(realmId: string, schemaId: string, key: string) {
    const response = await fieldAPI.createField({
      realmId,
      schemaId,
      body: { key, primitive: 'text' },
    })

    addField(response.data)
    updateFieldInSchema(response.data)
  }

  async function updateField(
    realmId: string,
    schemaId: string,
    fieldId: string,
    params: Partial<FieldEntity>,
  ) {
    const response = await fieldAPI.updateField({ realmId, schemaId, fieldId, body: params })

    addField(response.data)
    updateFieldInSchema(response.data)
  }

  async function deleteField(realmId: string, schemaId: string, fieldId: string) {
    const field = fieldsMap[fieldId]
    if (!field) {
      return
    }
    await fieldAPI.deleteField({ realmId, schemaId, fieldId })

    dispatchFields({ type: 'removeOne', id: fieldId })
    removeFieldInSchema(field)
  }

  useEffect(() => {
    if (realm.currentRealm) {
      loadSchemas()
    }
  }, [realm.currentRealm])

  return {
    schemas,
    sceneSchemas,
    nodeSchemas,
    currentSchemaId,
    currentSchema,
    schemaById,

    fields,
    currentFieldId,
    currentField,
    fieldsInSchema,
    fieldsInCurrentSchema,

    createSchema,
    createField,
    updateField,
    deleteField,
  }
}

export type SchemaStore = ReturnType<typeof useSchemaStore>

export const SchemaStoreContext = createContext<SchemaStore>(null)
