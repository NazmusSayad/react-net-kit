import useApi from './useApi'
import { HTTPBaseMethods } from '../types.t'
import { useCallback, useMemo } from 'react'
import useEffectOnce from '../../hooks/useEffectOnce'

export default <Base extends HTTPBaseMethods, T extends Record<string, any>>(
  instance: Base,
  params: any[],
  onLoad: any
) => {
  const api = useApi<Base, T>(instance, {
    startLoading: true,
  })

  const retryFunction = useCallback(async () => {
    const res = await api.requests(...params)
    onLoad && onLoad(res)
  }, [])

  useEffectOnce(retryFunction)
  return useMemo(
    () => ({
      ...api.state,
      state: api.state,
      retry: retryFunction,
    }),
    [api.state]
  )
}
