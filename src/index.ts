import axios, { CreateAxiosDefaults } from 'axios'
import { AxiosMethodsKeys } from './config'
import axiosWrapper, { WrapperOptions, WrappedMethods } from './wrapper'
import { StatusProps, StatusMethods } from './useStatus'
import useApiCore, { HookWrappedMethods } from './useApiCore'
import useApiOnceCore, { UseApiOnceParams } from './useApiOnceCore'

const ReactApi = (
  axiosConfig?: CreateAxiosDefaults,
  apiConfig?: WrapperOptions
) => {
  const instance = axios.create(axiosConfig)
  const coreMethods = axiosWrapper(instance, apiConfig)

  return {
    instance,
    methods: coreMethods,

    useApi() {
      return useApiCore(coreMethods)
    },

    useApiOnce(method: AxiosMethodsKeys, ...args: UseApiOnceParams) {
      return useApiOnceCore(coreMethods, method, ...args)
    },
  }
}

export {
  WrapperOptions as ReactApiOptions,
  WrappedMethods,
  HookWrappedMethods,
  StatusProps,
  StatusMethods,
  UseApiOnceParams,
}
export default ReactApi
