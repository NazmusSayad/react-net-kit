import { CoreResult, RootMethods } from '../types'
import { useEffect, useRef } from 'react'

export default (
  store: any,
  axiosFn: RootMethods['requests'],
  params: any[],
  onLoad?: Function
) => {
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

  store.promise = new Promise((resolve: Function) => {
    axiosFn(...params)
      .then((res: CoreResult | CoreResult[]) => {
        store.response = res
        onLoad && onLoad(store.response)
      })
      .finally(() => {
        delete store.promise
        resolve()
      })
  })

  throw store.promise
}
