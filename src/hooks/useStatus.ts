import { MergeObject } from '../types'
import { useCallback, useMemo, useRef, useState } from 'react'

const initialStatus = { loading: false, prev: { loading: false } }

export default function useStatus<T extends Record<string, any>>(
  startAsLoading = false
) {
  type Status = MergeObject<
    typeof initialStatus,
    T & { prev: MergeObject<typeof initialStatus, T> }
  >

  const [status, setStatus] = useState(() => ({
    ...(initialStatus as unknown as Status),
    loading: startAsLoading,
  }))

  const statusRef = useRef(status)
  statusRef.current = status

  const setState = useCallback((value: Record<string, any>) => {
    const { prev: _, ...newRest } = statusRef.current
    const { prev: __, ...oldRest } = { ...initialStatus, ...value }
    if (JSON.stringify(oldRest) === JSON.stringify(newRest)) return

    setStatus(
      (prev) =>
        ({
          ...initialStatus,
          ...value,
          prev,
        } as any)
    )
  }, [])

  return useMemo(
    () => ({
      ...status,
      setState,
    }),
    [status]
  )
}

export type SetStatus = ReturnType<typeof useStatus>['setState']
