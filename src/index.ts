import axios, { CreateAxiosDefaults } from 'axios'
import { AxiosMethodsKeys, AxiosMethods } from './config'
import axiosWrapper, { WrapperOptions } from './wrapper'
import { StatusProps, StatusMethods } from './useStatus'
import useApiCore from './useApiCore'
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
  UseApiOnceParams,
  WrapperOptions as ReactApiOptions,
  AxiosMethods,
  StatusProps,
  StatusMethods,
}
export default ReactApi
