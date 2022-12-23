import { useEffect, useRef } from 'react'
import { RootMethods } from '../creator/createRoot'
import { AxiosMethodsCoreParams, AxiosMethodsKeys } from '../config'
import { anchorSymbol, CreateAnchor, parseResponseList } from './utils'

export type UseSuspenseApiOnLoadFn = (data: any[]) => void

export type SuspenseApiOnceRequests = [
  AxiosMethodsKeys,
  ...AxiosMethodsCoreParams
][]

export default (
  rootMethods: RootMethods,
  anchor: CreateAnchor,
  requests: SuspenseApiOnceRequests,
  onLoad?: UseSuspenseApiOnLoadFn
): { error: any; data: any; ok: boolean }[] => {
  if (anchor.symbol !== anchorSymbol) throw new Error('Invalid anchor input.')
  const data = useRef(anchor.response)

  useEffect(() => {
    delete anchor.response
    return () => {
      delete anchor.response
    }
  }, [])

  if (data.current !== undefined) return data.current
  if (anchor.promise) throw anchor.promise

  anchor.promise = new Promise((res: any) => {
    const requestPromises = requests.map(([method, ...axiosArgs]) => {
      // @ts-ignore
      return rootMethods[method](...axiosArgs)
    })

    Promise.all(requestPromises)
      .then((data: any = null) => {
        const parsedData = parseResponseList(data)
        anchor.response = parsedData
        onLoad && onLoad(parsedData)
      })
      .finally(() => {
        delete anchor.promise
        res()
      })
  })

  throw anchor.promise
}
