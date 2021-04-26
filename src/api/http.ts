import axios from 'axios'

import { config } from '../config'

/** Http instance. */
export const http = axios.create({
  baseURL: config.api.baseUrl,
})
