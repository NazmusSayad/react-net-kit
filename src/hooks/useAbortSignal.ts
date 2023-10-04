import { MutableRefObject, useEffect, useRef } from 'react'

export default function () {
  const result = useRef() as MutableRefObject<
    [
      signal: () => AbortController['signal'],
      abortSignal: () => void,
      isActive: () => boolean
    ]
  >

  if (!result.current) {
    let prevController: AbortController | null

    const getIsActive = () => {
      return Boolean(
        prevController &&
          prevController.signal &&
          prevController.signal.aborted === false
      )
    }

    const abortSignal = () => {
      const isActive = getIsActive()
      if (isActive) prevController?.abort()
      prevController = null
      return isActive
    }

    const generateSignal = () => {
      abortSignal()
      const controller = new AbortController()
      prevController = controller
      return controller.signal
    }

    result.current = [generateSignal, abortSignal, getIsActive]
  }

  useEffect(() => result.current[1], [])
  return result.current
}
