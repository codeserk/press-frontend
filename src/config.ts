import { Config } from './interfaces/config.interface'

export const config: Config = {
  api: {
    useCache: process.env.NEXT_PUBLIC_CACHE === 'true' ?? false,
    baseUrl: process.env.NEXT_PUBLIC_GAME_BASE_URL,
  },
}

if (!config.api.baseUrl) {
  throw new Error(
    'Invalid configuration, "api.baseUrl" is not set. Ensure the env variable "NEXT_PUBLIC_GAME_BASE_URL" is set.',
  )
}
