import { CreateSchemaRequest, FieldEntity, SchemaEntity } from 'client'
import { useRouter } from 'next/router'
import { createContext, useEffect, useMemo, useState } from 'react'

import { SchemaEntityTypeEnum } from '../../client'
import { fieldAPI, schemaAPI } from '../api/clients'
import { RealmStore } from './realm.store'

export function useSchemaStore(realm: RealmStore) {
  const router = useRouter()

  // State
  const [schemasMap, setSchemas] = useState<Record<string, SchemaEntity>>({})
  const [fieldsMap, setFields] = useState<Record<string, FieldEntity>>({})

  // Getters
  const schemas = useMemo(() => Object.values(schemasMap), [schemasMap])
  const sceneSchemas = useMemo(
    () => schemas.filter((schema) => schema.type === SchemaEntityTypeEnum.Scene),
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

  // Mutations
  function addSchema(schema: SchemaEntity) {
    const schemas = { ...schemasMap }
    schemas[schema.id] = schema
    setSchemas(schemas)
  }

  function addField(field: FieldEntity) {
    const fields = { ...fieldsMap }
    fields[field.id] = field
    setFields(fields)
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

    setSchemas(schemasById)
    setFields(fieldsById)
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
  }

  async function updateField(
    realmId: string,
    schemaId: string,
    fieldId: string,
    params: Partial<FieldEntity>,
  ) {
    const response = await fieldAPI.updateField({ realmId, schemaId, fieldId, body: params })

    addField(response.data)
  }

  useEffect(() => {
    if (realm.currentRealm) {
      loadSchemas()
    }
  }, [realm.currentRealm])

  return {
    schemas,
    sceneSchemas,
    currentSchemaId,
    currentSchema,

    fields,
    currentFieldId,
    currentField,
    fieldsInSchema,
    fieldsInCurrentSchema,

    createSchema,
    createField,
    updateField,
  }
}

export type SchemaStore = ReturnType<typeof useSchemaStore>

export const SchemaStoreContext = createContext<SchemaStore>(null)
