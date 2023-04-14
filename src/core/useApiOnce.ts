import { useCallback, useMemo } from 'react'
import useApi from './useApi'
import { AllMethodsKeys, RootMethods } from '../types'
import useEffectOnce from '../hooks/useEffectOnce'

export default <Data, Error>(
  instance: RootMethods,
  method: AllMethodsKeys,
  params: any[],
  onLoad: Function
) => {
  const api = useApi<Data, Error>(instance, {
    useData: true,
    startLoading: true,
  })

  const retryFunction = useCallback(() => {
    const promise = (api[method] as any)(...params)
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
