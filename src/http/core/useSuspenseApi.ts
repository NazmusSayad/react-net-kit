import { useEffect, useRef } from 'react'
import { HTTPCoreResult, HTTPBaseMethods } from '../types.t'

export default <Base extends HTTPBaseMethods, T extends any>(
  fetch: Base['requests'],
  store: any,
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

  if (data.current !== undefined) return data.current as T
  if (store.promise) throw store.promise

  store.promise = new Promise((resolve: Function) => {
    fetch(...params)
      .then((res: HTTPCoreResult<{}>[]) => {
        store.response = res
        onLoad && onLoad(res)
      })
      .finally(() => {
        delete store.promise
        resolve()
      })
  })

  throw store.promise
}
