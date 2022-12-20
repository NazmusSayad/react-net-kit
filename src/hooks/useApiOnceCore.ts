import { useCallback, useEffect, useMemo, useRef } from 'react'
import { AxiosRequestConfig } from 'axios'
import { AxiosMethodsKeys } from '../config.js'
import { RootMethods } from '../creator/createRoot.js'
import useApiCore from './useApiCore.js'

type OnLoadFunction = (data: any) => void

export type UseApiOnceParams = [
  String | AxiosRequestConfig,
  (OnLoadFunction | Object | AxiosRequestConfig)?,
  (OnLoadFunction | AxiosRequestConfig)?,
  OnLoadFunction?
]

const useApiOnceCore = (
  coreMethods: RootMethods,
  method: AxiosMethodsKeys,
  ...args: UseApiOnceParams
) => {
  const api = useApiCore(coreMethods, {
    startAsLoading: true,
    hook: {
      useDataStatus: true,
    },
  })

  const runApi = useRef(() => {})
  runApi.current = () => {
    const onLoad: any = args[args.length - 1] instanceof Function && args.pop()

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
