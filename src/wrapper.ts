import { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { AxiosMethodsCore, AnyAxiosMethodCore, axiosMethods } from './config'
import {
  defaultGetFail,
  defaultGetSuccess,
  runSyncAsync,
  UseFunctionParams,
} from './utils'

export type WrapperOptions = {
  getSuccess?: (response: AxiosResponse) => any
  _getSuccess?: (response: AxiosResponse) => any
  getFail?: (err: AxiosError) => void
  _getFail?: (err: AxiosError) => void
}

type WrappedMethod<Func extends AnyAxiosMethodCore> = UseFunctionParams<
  Func,
  Promise<[any, any, boolean]>
>
export type WrappedMethods = {
  [Key in keyof AxiosMethodsCore]: WrappedMethod<AxiosMethodsCore[Key]>
}
export type AnyWrappedMethod = WrappedMethods[keyof WrappedMethods]

const wrapper = (
  axios: AxiosInstance,
  config: WrapperOptions = {}
): WrappedMethods => {
  const conf: WrapperOptions = {
    _getSuccess: undefined,
    getSuccess: defaultGetSuccess,
    _getFail: undefined,
    getFail: defaultGetFail,
    ...config,
  }

  const wrap = <T extends AnyAxiosMethodCore>(axiosFn: T): WrappedMethod<T> => {
    return async (...arg: any[]) => {
      try {
        const response = await axiosFn(...(arg as [any]))
        await runSyncAsync(conf._getSuccess, response)
        return [undefined, await runSyncAsync(conf.getSuccess, response), true]
      } catch (err) {
        await runSyncAsync(conf._getFail, err)
        return [await runSyncAsync(conf.getFail, err), undefined, false]
      }
    }
  }

  // @ts-ignore
  const wrappedMethods: WrappedMethods = {}

  for (let key in axios) {
    if (!axiosMethods.includes(key)) continue
    // @ts-ignore
    wrappedMethods[key] = wrap(axios[key])
  }

  return wrappedMethods
}

export default wrapper
