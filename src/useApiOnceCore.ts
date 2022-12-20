import { useCallback, useEffect, useMemo, useRef } from 'react'
import { AxiosRequestConfig } from 'axios'
import { AxiosMethods, AxiosMethodsKeys } from './config'
import useApiCore from './useApiCore'

type OnLoadFunction = (data: any) => void

export type UseApiOnceParams = [
  String | AxiosRequestConfig,
  (OnLoadFunction | Object | AxiosRequestConfig)?,
  (OnLoadFunction | AxiosRequestConfig)?,
  OnLoadFunction?
]

const useApiOnceCore = (
  coreMethods: AxiosMethods,
  method: AxiosMethodsKeys,
  ...args: UseApiOnceParams
) => {
  const api = useApiCore(coreMethods, {
    startAsLoading: true,
  })

  const runApi = useRef(() => {})
  runApi.current = () => {
    // @ts-ignore
    const onLoad: Function =
      args[args.length - 1] instanceof Function && args.pop()

    // @ts-ignore
    const axiosFn = api.methods[method.toLowerCase()]
    axiosFn(...args).then(onLoad)
  }

  const retryApi = useCallback(() => runApi.current(), [])
  useEffect(retryApi, [])

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

export default useApiOnceCore
