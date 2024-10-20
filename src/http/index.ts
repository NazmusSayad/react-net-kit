import axios from 'axios'
import createHooks from './createHooks'
import { HTTPOptions } from './types.t'
import { httpDefaultConfig } from '../config'
import createBaseMethods from './createMethods'

/**
 *
 * @param options - This is the config of axios and 'formatError' and 'formatData' functions
 * @returns - Everything you need to make HTTP requests
 *
 * ## Basic usage
 *
 * ```ts
 * import ReactNetKit from 'react-net-kit'
 * export const { useApi, useApiOnce, createSuspense } = ReactNetKit()
 * ```
 */
export default function <O extends HTTPOptions>(options?: O) {
  const { formatData, formatError, ...axiosOptions } = {
    ...httpDefaultConfig,
    ...(options ?? {}),
  }

  const axiosInstance = axios.create(axiosOptions)
  const baseConfig = { formatData, formatError }
  const baseMethods = createBaseMethods(axiosInstance, baseConfig)
  const hooks = createHooks<typeof baseMethods>(baseMethods)

  return {
    ...hooks,
    ...baseMethods,
    axios: axiosInstance,
  }
}
