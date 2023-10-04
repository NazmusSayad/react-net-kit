import axios from 'axios'
import { Prettify } from '../types'
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
 * import ReactHTTP from 'react-net-kit'
 * export const { useApi, useApiOnce, createSuspense } = ReactHTTP()
 * ```
 */
export default function <O extends HTTPOptions>(options?: O) {
  type FallBack = Prettify<
    (undefined extends O['formatData']
      ? {}
      : { data: ReturnType<Exclude<O['formatData'], undefined>> }) &
      (undefined extends O['formatError']
        ? {}
        : { error: ReturnType<Exclude<O['formatError'], undefined>> })
  >

  const { formatData, formatError, ...axiosOptions } = {
    ...httpDefaultConfig,
    ...(options ?? {}),
  }

  const axiosInstance = axios.create(axiosOptions)
  const baseConfig = { formatData, formatError }
  const baseMethods = createBaseMethods<FallBack>(axiosInstance, baseConfig)
  const hooks = createHooks<typeof baseMethods, FallBack>(baseMethods)

  return {
    ...hooks,
    ...baseMethods,
    axios: axiosInstance,
  }
}
