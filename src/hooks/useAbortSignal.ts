import { useEffect, useMemo, useRef } from 'react'

export interface AbortSignal {
  abort(): boolean
  readonly isActive: boolean
  readonly isAborted: boolean
  readonly signal: AbortController['signal']
}

export default (): AbortSignal => {
  const done = useRef<AbortSignal>()

  const abortSignal = useMemo(() => {
    if (done.current) return done.current
    let prevController: AbortController | null

    const result = {
      abort() {
        const isActive = Boolean(
          prevController &&
            prevController.signal &&
            prevController.signal.aborted === false
        )

        if (isActive) prevController?.abort()
        prevController = null
        return isActive
      },

      get isAborted() {
        return Boolean(prevController?.signal?.aborted)
      },

      get isActive() {
        // @ts-ignore
        return !this.isAborted
      },

      get signal() {
        this.abort()
        const controller = new AbortController()
        prevController = controller
        return controller.signal
      },
    }

    done.current = result
    return result
  }, [])

  useEffect(() => {
    return () => {
      abortSignal.abort()
    }
  }, [])

  return abortSignal
}
