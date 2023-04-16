import { useMemo } from 'react'
import useStatus from '../helpers/useStatus'
import useMemoOnce from '../helpers/useMemoOnce'
import { RootMethods } from '../types'
import createStatusMethods from './createStatusMethods'
import useSuspense from '../helpers/useSuspense'

export default <Data, Error>(
  instance: RootMethods,
  { useData = false, startLoading = false, suspense = false }
) => {
  const [status, setStatus] = useStatus<Data, Error>(startLoading)
  useSuspense(suspense && status.loading)

  const methods = useMemoOnce(() =>
    createStatusMethods(instance, setStatus, useData)
  )

  return useMemo(
    () => ({ ...status, ...methods, status, setStatus, methods }),
    [status]
  )
}
