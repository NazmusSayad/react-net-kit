import { useEffect, useRef } from 'react'

export default (effect: () => any) => {
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    effect()
    called.current = true
  }, [])
}
