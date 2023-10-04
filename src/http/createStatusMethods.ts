import { SetStatus } from '../hooks/useStatus'

export default <T>(methods: T, setStatus: SetStatus) => {
  const result: any = {}

  for (let key in methods) {
    const axiosWrappedFn = async (...args: any[]) => {
      setStatus({ loading: true })
      const axiosFn = methods[key] as any
      const res = await axiosFn(...args)

      res instanceof Array
        ? setStatus({ responses: res, ok: res.every((r) => r.ok) })
        : setStatus({ response: res, ok: res.ok })

      return res
    }

    result[key] = axiosWrappedFn
  }

  return result as T
}
