import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { Config } from '../interfaces/config.interface'

/**
 * Generates an http client with the given configuration
 * @param config
 * @returns http client
 */
export function generateHttpClient(config?: Config) {
  const http = axios.create({
    baseURL: config?.api.baseUrl,
  })

  http.interceptors.request.use((axiosConfig: AxiosRequestConfig) => {
    console.debug('making request', {
      url: `${axiosConfig.method}: ${axiosConfig.url}`,
      data: axiosConfig.data,
    })

    return axiosConfig
  })
  http.interceptors.response.use(
    (res: AxiosResponse) => {
      console.debug('http response', {
        url: res.config.url,
        data: res.data,
      })

      return res
    },
    (error) => {
      console.warn('http error', {
        data: error.data,
        response: error.response?.data,
      })

      return Promise.reject(error)
    },
  )

  return http
}
