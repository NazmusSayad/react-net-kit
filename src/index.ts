import { useCallback, useEffect, useMemo } from 'react'
import axios, { CreateAxiosDefaults } from 'axios'
import axiosWrapper from './wrapper'
import { WrapperOptions } from './wrapper'
import { AxiosMethodsKeys } from './config'
import useApiCore from './useApiCore'

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
      return useApiCore(coreMethods, { keepData: false })
    },

    useApiOnce(method: AxiosMethodsKeys, ...args: any[]) {
      const api = useApiCore(coreMethods, {
        keepData: true,
        startAsLoading: true,
      })

      const runApi = useCallback(() => {
        const onLoad: (data: any) => void =
          args[args.length - 1] instanceof Function && args.pop()

        // @ts-ignore
        const axiosFn = api.methods[method.toLowerCase()]

        // @ts-ignore
        axiosFn(...args).then(onLoad)
      }, [method, ...args])

      useEffect(runApi, [])

      return useMemo(() => {
        return {
          ...api.status,
          setStatus: api.setStatus,
          retry: runApi,
        }
      }, [api.status])
    },
  }
}

export default ReactApi
