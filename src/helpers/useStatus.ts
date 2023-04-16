import { useMemo, useRef, useState } from 'react'
import { isSame } from '../utils'

const initialStatus = {
  loading: false,
  data: undefined as any,
  error: undefined as any,
}

const useStatus = <DataType = any, ErrorType = any>(
  startAsLoading = false
): [typeof status, typeof statusMethods] => {
  const [status, setStatus] = useState(() => ({
    ...(initialStatus as {
      loading: boolean
      data: DataType
      error: ErrorType
    }),
    loading: startAsLoading,
  }))

  const statusRef = useRef({}) as { current: typeof status }
  Object.assign(statusRef.current, status)

  const statusMethods = useMemo(
    () => ({
      loading(loading = true) {
        if (isSame(statusRef.current.loading, loading)) return
        setStatus({
          ...initialStatus,
          loading,
        })
      },

      data(data: DataType) {
        if (isSame(statusRef.current.data, data)) return
        setStatus({
          ...initialStatus,
          data,
        })
      },

      error(error: ErrorType) {
        if (isSame(statusRef.current.error, error)) return
        setStatus({
          ...initialStatus,
          error,
        })
      },

      raw(data: DataType, error: ErrorType) {
        setStatus({
          ...initialStatus,
          error,
          data,
        })
      },

      reset() {
        if (isSame(statusRef.current, initialStatus)) return
        setStatus({
          ...initialStatus,
        })
      },
    }),
    []
  )

  return useMemo(() => [status, statusMethods], [status])
}

export default useStatus
export type DemoStatusProps = ReturnType<typeof useStatus>[0]
export type DemoStatusMethods = ReturnType<typeof useStatus>[1]
