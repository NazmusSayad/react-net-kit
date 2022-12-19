import { useMemo, useState } from 'react'

const defaultInitialStatus = {
  loading: false,
  data: undefined,
  error: undefined,
}

const isSame = (a: any, b: any): boolean => {
  return a === b || JSON.stringify(a) === JSON.stringify(b)
}

type StatusProps = {
  loading: boolean
  data: any
  error: any
}

type StatusMethods = {
  loading: (isLoading?: boolean) => void
  data: (data: any) => void
  error: (error: any) => void
  reset: () => void
}

const useStatus = (startAsLoading = false): [StatusProps, StatusMethods] => {
  const [status, setStatus] = useState(() => {
    return { ...defaultInitialStatus, loading: startAsLoading }
  })

  // @ts-ignore
  const [statusRef]: [typeof status] = useState({})
  Object.assign(statusRef, status)

  const setStatusModified = useMemo(
    () => ({
      loading(loading = true) {
        if (isSame(statusRef.loading, loading)) return

        setStatus({
          ...defaultInitialStatus,
          loading,
        })
      },

      data(data: any) {
        if (isSame(statusRef.data, data)) return

        setStatus({
          ...defaultInitialStatus,
          data,
        })
      },

      error(error: any) {
        if (isSame(statusRef.error, error)) return

        setStatus({
          ...defaultInitialStatus,
          error,
        })
      },

      reset() {
        if (isSame(statusRef, defaultInitialStatus)) return

        setStatus({
          ...defaultInitialStatus,
        })
      },
    }),
    []
  )

  return useMemo(() => [status, setStatusModified], [status])
}

export default useStatus
