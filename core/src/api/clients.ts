import { AxiosInstance } from 'axios'

import { AuthApi, Configuration, FieldApi, NodeApi, RealmApi, SchemaApi, UserApi } from '../client'
import { Config } from '../interfaces/config.interface'
import { generateHttpClient } from './http'

const defaultHttp = generateHttpClient()

class ClientsManager {
  protected userAPI = new UserApi(undefined, undefined, defaultHttp)
  protected authAPI = new AuthApi(undefined, undefined, defaultHttp)
  protected realmAPI = new RealmApi(undefined, undefined, defaultHttp)
  protected schemaAPI = new SchemaApi(undefined, undefined, defaultHttp)
  protected fieldAPI = new FieldApi(undefined, undefined, defaultHttp)
  protected nodeAPI = new NodeApi(undefined, undefined, defaultHttp)

  protected readonly subscribers: ((http: AxiosInstance) => void)[] = []

  /**
   * Initializes the clients using a configuration and JWT.
   * @param config
   * @param jwt
   */
  init(config: Config, jwt?: string) {
    const http = generateHttpClient(config)
    const apiKey = `bearer ${jwt}`

    this.authAPI = new AuthApi(new Configuration({ apiKey }), config?.api.baseUrl, http)
    this.userAPI = new UserApi(new Configuration({ apiKey }), config?.api.baseUrl, http)
    this.realmAPI = new RealmApi(new Configuration({ apiKey }), config?.api.baseUrl, http)
    this.schemaAPI = new SchemaApi(new Configuration({ apiKey }), config?.api.baseUrl, http)
    this.fieldAPI = new FieldApi(new Configuration({ apiKey }), config?.api.baseUrl, http)
    this.nodeAPI = new NodeApi(new Configuration({ apiKey }), config?.api.baseUrl, http)

    for (const fn of this.subscribers) {
      fn(http)
    }
  }

  subscribe(fn: (http: AxiosInstance) => void) {
    this.subscribers.push(fn)
  }

  get auth() {
    return this.authAPI
  }

  get users() {
    return this.userAPI
  }

  get realms() {
    return this.realmAPI
  }

  get schemas() {
    return this.schemaAPI
  }

  get fields() {
    return this.fieldAPI
  }

  get nodes() {
    return this.nodeAPI
  }
}

export const api = new ClientsManager()
