import { useMemo } from 'react'
import { HTTPBaseMethods } from '../types.t'
import useStatus from '../../hooks/useStatus'
import useSuspense from '../../hooks/useSuspense'
import useMemoOnce from '../../hooks/useMemoOnce'
import createStatusMethods from '../createStatusMethods'

export default <Base extends HTTPBaseMethods, T extends Record<string, any>>(
  base: Base,
  { startLoading = false, suspense = false }
) => {
  const state = useStatus<T>(startLoading)
  useSuspense(suspense && state.loading)
  const methods = useMemoOnce(() => createStatusMethods(base, state.setState))
  return useMemo(() => ({ ...state, ...methods, state, methods }), [state])
}
