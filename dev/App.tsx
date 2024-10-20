import React from 'react'
import ReactNetKit, { useAbortSignal } from '../src'

const netKit = ReactNetKit()

export default function App() {
  const [abortSignal] = useAbortSignal()
  const api = netKit.useApi()

  React.useEffect(() => {
    ;(async () => {
      const res = await api.get(
        'https://jsonplaceholder.typicode.com/todos/1',
        {
          signal: abortSignal(),
        }
      )

      if (res.ok) return
      res.data
      res.error
    })()
  }, [])

  return <div>App</div>
}
