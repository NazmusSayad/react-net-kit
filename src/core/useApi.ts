import { useMemo } from 'react'
import useStatus from '../hooks/useStatus'
import useMemoOnce from '../hooks/useMemoOnce'
import { RootMethods } from '../types'
import createStatusMethods from './createStatusMethods'
import useReactSuspense from '../hooks/useSuspense'

export default <Data, Error>(
  instance: RootMethods,
  { useData = false, startLoading = false, suspense = false }
) => {
  const [status, setStatus] = useStatus<Data, Error>(startLoading)
  useReactSuspense(suspense && status.loading)

  const methods = useMemoOnce(() =>
    createStatusMethods(instance, setStatus, useData)
  )

  return useMemo(
    () => ({ ...status, ...methods, status, setStatus, methods }),
    [status]
  )
}
