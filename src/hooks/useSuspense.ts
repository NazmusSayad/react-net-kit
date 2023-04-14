import { useRef } from 'react'

export default (suspended: Boolean = false) => {
  const promise = useRef<any>()

  if (suspended && !promise.current) {
    throw new Promise((resolve) => {
      promise.current = { resolve }
    })
  }

  if (!suspended && promise.current) {
    promise.current.resolve()
    promise.current = undefined
  }
}
