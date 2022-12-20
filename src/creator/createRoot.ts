import { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import {
  AnyAxiosMethodCore,
  axiosMethods,
  AxiosMethodsCore,
} from '../config.js'
import { runSyncAsync, UseFunctionParams } from '../utils.js'

export type CreateRootConfig = {
  getSuccess?: (response: AxiosResponse) => any
  _getSuccess?: (response: AxiosResponse) => any
  getFail?: (err: AxiosError) => void
  _getFail?: (err: AxiosError) => void
}

export type RootMethods = {
  [Key in keyof AxiosMethodsCore]: UseFunctionParams<
    AxiosMethodsCore[Key],
    Promise<[any, any, boolean]>
  >
}

export type AnyRootMethod = RootMethods[keyof RootMethods]

const defaultConfig: CreateRootConfig = {
  getSuccess: (response) => {
    return response.status === 204 ? true : response.data?.data || response.data
  },
  getFail: (err: any): String | String[] => {
    return err.response?.data?.message || err.message
  },
}

const runRoot = async <Fn extends AnyAxiosMethodCore>(
  instanceFn: Fn,
  config: CreateRootConfig,
  axiosArgs: Parameters<Fn>
): Promise<[any, any, boolean]> => {
  try {
    const response = await instanceFn(...(axiosArgs as [any]))
    await runSyncAsync(config._getSuccess, response)
    return [undefined, await runSyncAsync(config.getSuccess, response), true]
  } catch (err) {
    await runSyncAsync(config._getFail, err)
    return [await runSyncAsync(config.getFail, err), undefined, false]
  }
}

export default (
  instance: AxiosInstance,
  config: CreateRootConfig = {}
): RootMethods => {
  const conf = { ...defaultConfig, ...config }

  const rootMethods: any = {}
  for (let key in instance) {
    // @ts-ignore
    if (!axiosMethods.includes(key)) continue

    // @ts-ignore
    const instanceFn: AnyAxiosMethodCore = instance[key]

    rootMethods[key] = (...axiosArgs: Parameters<AnyAxiosMethodCore>) => {
      return runRoot(instanceFn, conf, axiosArgs)
    }
  }

  return rootMethods
}
