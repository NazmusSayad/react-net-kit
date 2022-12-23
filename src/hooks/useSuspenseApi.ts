import { useEffect, useRef } from 'react'
import { AxiosMethodsCoreParams, AxiosMethodsKeys } from '../config'
import { RootMethods } from '../creator/createRoot.js'

export const anchorSymbol = Symbol('useSuspenseApi')

export type CreateAnchor = {
  symbol: Symbol
  data?: unknown
  error?: unknown
}

export const createAnchor = (): CreateAnchor => {
  return {
    symbol: anchorSymbol,
    data: undefined,
    error: undefined,
  }
}

export default (
  rootMethods: RootMethods,
  anchor: CreateAnchor,
  method: AxiosMethodsKeys,
  axiosArgs: AxiosMethodsCoreParams
) => {
  if (anchor.symbol !== anchorSymbol) throw new Error('Invalid anchor input.')
  const data = useRef({
    data: anchor.data,
    error: anchor.error,
  })

  useEffect(() => {
    delete anchor.data
    delete anchor.error
  }, [])

  if (data.current.data || data.current.error) {
    return data.current
  }

  throw new Promise((res) => {
    // @ts-ignore
    rootMethods[method](...axiosArgs).then(([err, data, ok]) => {
      if (ok) {
        anchor.data = data
      } else {
        anchor.error = err
      }

      setTimeout(() => {
        res(anchor)
      }, 3000)
    })
  })
}
