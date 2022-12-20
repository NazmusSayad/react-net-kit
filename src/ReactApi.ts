import { useMemo } from 'react'
import axios, { CreateAxiosDefaults } from 'axios'
import { AxiosMethodsKeys } from './config.js'
import createRoot, { CreateRootConfig } from './creator/createRoot.js'
import useApiCore from './hooks/useApiCore.js'
import useApiOnceCore, { UseApiOnceParams } from './hooks/useApiOnceCore.js'

const ReactApi = (
  axiosConfig?: CreateAxiosDefaults,
  createRootConfig?: CreateRootConfig
) => {
  const instance = axios.create(axiosConfig)
  const rootMethods = createRoot(instance, createRootConfig)

  return {
    instance,
    methods: rootMethods,

    useApi() {
      const api = useApiCore(rootMethods)

      return useMemo(
        () => ({
          ...api.status,
          ...api.methods,
          status: api.status,
          setStatus: api.setStatus,
          methods: api.methods,
        }),
        [api.status]
      )
    },

    useApiOnce(method: AxiosMethodsKeys, ...args: UseApiOnceParams) {
      return useApiOnceCore(rootMethods, method, ...args)
    },
  }
}

export default ReactApi
