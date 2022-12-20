import { useMemo, useRef, useState } from 'react'
import { isSame } from './utils'

export type StatusProps = {
  loading: boolean
  error: any
  data: any
}

export type StatusMethods = {
  loading: (isLoading?: boolean) => void
  data: (data: any) => void
  error: (error: any) => void
  reset: () => void
}

const initialStatus: StatusProps = {
  loading: false,
  data: undefined,
  error: undefined,
}

const useStatus = (startAsLoading = false): [StatusProps, StatusMethods] => {
  const [status, setStatus] = useState(() => ({
    ...initialStatus,
    loading: startAsLoading,
  }))

  // @ts-ignore
  const statusRef: { current: typeof status } = useRef({})
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

      data(data: any) {
        if (isSame(statusRef.current.data, data)) return

        setStatus({
          ...initialStatus,
          data,
        })
      },

      error(error: any) {
        if (isSame(statusRef.current.error, error)) return

        setStatus({
          ...initialStatus,
          error,
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

export type UseStatusConfig = Parameters<typeof useStatus>[0]
export default useStatus
