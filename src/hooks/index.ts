import { useEffect, useMemo } from 'react'
import useSuspenseReact from 'use-suspense-react'
import { RootMethods } from '../creator/createRoot.js'
import { AxiosMethodsCoreParams, AxiosMethodsKeys } from '../config.js'
import { CreateAnchor, getLastFunction } from './utils.js'
import useApiCore from './useApiCore.js'
import useApiOnce, { UseApiOnceOnLoadFn } from './useApiOnce.js'
import useSuspenseApi, {
  SuspenseApiOnceRequests,
  UseSuspenseApiOnLoadFn,
} from './useSuspenseApi.js'

export default (rootMethods: RootMethods) => {
  return {
    useApi({ suspense = false } = {}) {
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
    },

    useApiOnce(
      method: AxiosMethodsKeys,
      ...axiosArgs:
        | AxiosMethodsCoreParams
        | [...AxiosMethodsCoreParams, UseApiOnceOnLoadFn]
    ) {
      const [args, onLoad] = getLastFunction(axiosArgs)
      const api = useApiOnce(rootMethods, method, args, onLoad)
      useEffect(() => {
        api.retry()
      }, [])
      return api
    },

    useSuspenseApiOnce(
      anchor: CreateAnchor,
      ...requests:
        | SuspenseApiOnceRequests
        | [...SuspenseApiOnceRequests, UseSuspenseApiOnLoadFn]
    ) {
      const [args, onLoad] = getLastFunction(requests)
      return useSuspenseApi(rootMethods, anchor, args, onLoad)
    },
  }
}
