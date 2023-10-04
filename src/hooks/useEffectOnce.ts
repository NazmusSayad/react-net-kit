import { useLayoutEffect, useRef } from 'react'

export default function (cb: Function) {
  const ref = useRef(false)
  useLayoutEffect(() => {
    if (ref.current) return
    ref.current = true
    cb()
  }, [])
}
