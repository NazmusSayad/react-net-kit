import { useCallback, useMemo, useRef } from 'react'
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
  axiosArgs: UseApiOnceParams
) => {
  const api = useApiCore(coreMethods, {
    startAsLoading: true,
    hook: {
      useDataStatus: true,
    },
  })

  const retryApiRef = useRef<() => Promise<any>>()
  retryApiRef.current = async () => {
    const onLoad: any =
      axiosArgs[axiosArgs.length - 1] instanceof Function && axiosArgs.pop()

    // @ts-ignore
    const axiosFn = api.methods[method.toLowerCase()]
    const data = await axiosFn(...axiosArgs)
    onLoad && onLoad(data)
    return data
  }

  // @ts-ignore
  const retryApi = useCallback(() => retryApiRef.current(), [])

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
