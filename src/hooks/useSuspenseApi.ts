import { useEffect, useRef } from 'react'
import { RootMethods } from '../creator/createRoot'
import { AxiosMethodsCoreParams, AxiosMethodsKeys } from '../config'
import { parseResponseList } from './utils'

export default (
  rootMethods: RootMethods,
  store: SuspenseStore,
  requests: SuspenseApiOnceRequests,
  onLoad?: UseSuspenseApiOnLoadFn
): SuspenseApiResponse => {
  const data = useRef(store.response)

  useEffect(() => {
    if (store.cache) return
    delete store.response
    return () => {
      delete store.response
    }
  }, [])

  if (data.current !== undefined) return data.current
  if (store.promise) throw store.promise

  store.promise = new Promise((res: any) => {
    const requestPromises = requests.map(([method, ...axiosArgs]) => {
      // @ts-ignore
      return rootMethods[method](...axiosArgs)
    })

    Promise.all(requestPromises)
      .then((data: any = null) => {
        const parsedData = parseResponseList(data)
        store.response = parsedData
        onLoad && onLoad(parsedData)
      })
      .finally(() => {
        delete store.promise
        res()
      })
  })

  throw store.promise
}

export type SuspenseApiResponse = { error: any; data: any; ok: boolean }[]

export type UseSuspenseApiOnLoadFn = (response: SuspenseApiResponse) => void

export type SuspenseStore = {
  response?: any
  promise?: Promise<any>
  cache?: boolean
}

export type SuspenseApiOnceRequests = [
  AxiosMethodsKeys,
  ...AxiosMethodsCoreParams
][]
