import { useCallback, useMemo } from 'react'
import useApi from './useApi'
import { RootMethods } from '../types'
import useEffectOnce from '../helpers/useEffectOnce'

export default <Data, Error>(
  instance: RootMethods,
  params: any[],
  onLoad: any
) => {
  const api = useApi<Data, Error>(instance, {
    useData: true,
    startLoading: true,
  })

  const retryFunction = useCallback(() => {
    const promise = api.requests(...params)
    onLoad && promise.then(onLoad)
  }, [])

  useEffectOnce(retryFunction)
  return useMemo(
    () => ({
      ...api.status,
      status: api.status,
      setStatus: api.setStatus,
      retry: retryFunction,
    }),
    [api.status]
  )
}
