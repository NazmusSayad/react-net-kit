import { useEffect, useMemo } from 'react'
import useSuspenseReact from 'use-suspense-react'
import { RootMethods } from '../creator/createRoot.js'
import { AxiosMethodsCoreParams, AxiosMethodsKeys } from '../config.js'
import useApiCore from './useApiCore.js'
import useApiOnceCore, { UseApiOnceParams } from './useApiOnceCore.js'
import useApiSuspense, { CreateAnchor } from './useSuspenseApi.js'

export default (rootMethods: RootMethods) => {
  const useApi = ({ suspense = false } = {}) => {
    const api = useApiCore(rootMethods)

    useSuspenseReact(suspense && api.status.loading)

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
  }

  const useApiOnce = (
    method: AxiosMethodsKeys,
    ...axiosArgs: UseApiOnceParams
  ) => {
    const api = useApiOnceCore(rootMethods, method, axiosArgs)
    useEffect(() => {
      api.retry()
    }, [])
    return api
  }

  const useSuspenseApiOnce = (
    anchor: CreateAnchor,
    method: AxiosMethodsKeys,
    ...axiosArgs: AxiosMethodsCoreParams
  ) => {
    return useApiSuspense(rootMethods, anchor, method, axiosArgs)
  }

  return {
    useApi,
    useApiOnce,
    useSuspenseApiOnce,
  }
}
