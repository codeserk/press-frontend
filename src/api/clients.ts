import { Configuration, FieldApi, NodeApi, RealmApi, SchemaApi } from '../../client'
import { http } from './http'

export let realmAPI = new RealmApi(undefined, undefined, http)
export let schemaAPI = new SchemaApi(undefined, undefined, http)
export let fieldAPI = new FieldApi(undefined, undefined, http)
export let nodeAPI = new NodeApi(undefined, undefined, http)

export function initClients(jwt: string) {
  const apiKey = `bearer ${jwt}`

  realmAPI = new RealmApi(new Configuration({ apiKey }), undefined, http)
  schemaAPI = new SchemaApi(new Configuration({ apiKey }), undefined, http)
  fieldAPI = new FieldApi(new Configuration({ apiKey }), undefined, http)
  nodeAPI = new NodeApi(new Configuration({ apiKey }), undefined, http)
}
