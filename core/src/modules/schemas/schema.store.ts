import { createContext, useEffect, useMemo, useReducer, useState } from 'react'

import { api } from '../../api/clients'
import { CreateSchemaRequest, FieldEntity, SchemaEntity, SchemaEntityTypeEnum } from '../../client'
import { Route } from '../../interfaces/route.interface'
import { EntityReducer, entityReducer } from '../../utils/store'
import { RealmStore } from '../realms/realm.store'

export function useSchemaStore(route: Route, realm: RealmStore) {
  // State
  const [isInitialized, setInitialized] = useState(false)
  const [schemasMap, dispatchSchemas] = useReducer(
    entityReducer as EntityReducer<string, SchemaEntity>,
    {},
  )
  const [fieldsMap, dispatchFields] = useReducer(
    entityReducer as EntityReducer<string, FieldEntity>,
    {},
  )

  // Getters
  const schemas = useMemo(() => Object.values(schemasMap), [schemasMap])
  const sceneSchemas = useMemo(
    () => schemas.filter((schema) => schema.type === SchemaEntityTypeEnum.Scene),
    [schemas],
  )
  const modelSchemas = useMemo(
    () => schemas.filter((schema) => schema.type === SchemaEntityTypeEnum.Model),
    [schemas],
  )
  const viewSchemas = useMemo(
    () => schemas.filter((schema) => schema.type === SchemaEntityTypeEnum.View),
    [schemas],
  )
  const currentSchemaId = useMemo(() => route.schemaId as string, [route.schemaId])
  const currentSchema = useMemo(() => schemasMap[currentSchemaId], [schemasMap, currentSchemaId])

  const fields = useMemo(() => Object.values(fieldsMap), [fieldsMap])
  const currentFieldId = useMemo(() => route.fieldId as string, [route.fieldId])
  const currentField = useMemo(() => fieldsMap[currentFieldId], [fieldsMap, currentFieldId])

  const fieldsInSchema = (schemaId: string) => fields.filter((field) => field.schemaId === schemaId)
  const fieldsInCurrentSchema = useMemo(
    () => fieldsInSchema(currentSchemaId),
    [fieldsInSchema, currentSchemaId],
  )

  function schemaById(id: string): SchemaEntity | undefined {
    return schemasMap[id]
  }

  // Mutations
  function addSchema(schema: SchemaEntity) {
    dispatchSchemas({ type: 'addOne', item: schema })
  }

  function addField(field: FieldEntity) {
    dispatchFields({ type: 'addOne', item: field })
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
    setInitialized(false)
    const response = await api.schemas.getSchemas({ realmId: realm.currentRealmId })

    const schemasById: Record<string, SchemaEntity> = {}
    const fieldsById: Record<string, FieldEntity> = {}
    for (const schema of response.data) {
      schemasById[schema.id] = schema

      for (const field of schema.fields) {
        fieldsById[field.id] = field
      }
    }

    dispatchSchemas({ type: 'addMany', items: schemasById })
    dispatchFields({ type: 'addMany', items: fieldsById })
    setInitialized(true)
  }

  async function createSchema(realmId: string, params: CreateSchemaRequest) {
    const response = await api.schemas.createSchema({ realmId, body: params })
    const newSchema = response.data

    addSchema(newSchema)
  }

  async function createField(realmId: string, schemaId: string, key: string) {
    const response = await api.fields.createField({
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
    const response = await api.fields.updateField({ realmId, schemaId, fieldId, body: params })

    addField(response.data)
    updateFieldInSchema(response.data)
  }

  async function deleteField(realmId: string, schemaId: string, fieldId: string) {
    const field = fieldsMap[fieldId]
    if (!field) {
      return
    }
    await api.fields.deleteField({ realmId, schemaId, fieldId })

    dispatchFields({ type: 'removeOne', id: fieldId })
    removeFieldInSchema(field)
  }

  useEffect(() => {
    dispatchSchemas({ type: 'clear' })
    dispatchFields({ type: 'clear' })
    setInitialized(false)

    if (realm.currentRealm) {
      loadSchemas()
    }
  }, [realm.currentRealm])

  return {
    isInitialized,
    schemas,
    sceneSchemas,
    modelSchemas,
    viewSchemas,
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
