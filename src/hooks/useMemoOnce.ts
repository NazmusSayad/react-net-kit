import { useRef } from 'react'
const emptySymbol = Symbol('null')

export default <T extends any>(fn: () => T): T => {
  const ref = useRef(emptySymbol as T)
  if (ref.current === emptySymbol) {
    ref.current = fn()
  }
  return ref.current
}
