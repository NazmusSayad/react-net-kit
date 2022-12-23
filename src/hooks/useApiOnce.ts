import { useCallback, useMemo, useRef } from 'react'
import { AxiosMethodsCoreParams, AxiosMethodsKeys } from '../config.js'
import { RootMethods } from '../creator/createRoot.js'
import useEffectOnce from '../heplers/useEffectOnce.js'
import useApiCore from './useApiCore.js'

export type UseApiOnceOnLoadFn = (data: any) => void

export default (
  coreMethods: RootMethods,
  method: AxiosMethodsKeys,
  axiosArgs: AxiosMethodsCoreParams,
  onLoad?: UseApiOnceOnLoadFn
) => {
  const api = useApiCore(coreMethods, {
    startAsLoading: true,
    hook: {
      useDataStatus: true,
    },
  })

  const retryApiRef = useRef<() => Promise<any>>()
  retryApiRef.current = async () => {
    // @ts-ignore
    const axiosFn = api.methods[method.toLowerCase()]
    const data = await axiosFn(...axiosArgs)
    onLoad && onLoad(data)
    return data
  }

  // @ts-ignore
  const retryApi = useCallback(() => retryApiRef.current(), [])
  useEffectOnce(() => {
    retryApi()
  })

  return useMemo(
    () => ({
      ...api.status,
      retry: retryApi,
      status: api.status,
      setStatus: api.setStatus,
    }),
    [api.status]
  )
}
