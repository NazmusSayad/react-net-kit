import { useMemo } from 'react'
import useStatus from './useStatus'
import { AxiosMethods } from './config'

const useApiCore = (
  coreMethods: AxiosMethods,
  apiHookConfig: {
    keepData?: boolean
    startAsLoading?: boolean
  }
) => {
  const [status, setStatus] = useStatus(apiHookConfig?.startAsLoading)

  const wrapWithHook = (methodFn: Function) => {
    return async (...args: any[]) => {
      setStatus.loading()
      const [err, data] = await methodFn(...args)

      if (data !== undefined) {
        setStatus.data(data)
      } else if (err !== undefined) {
        setStatus.error(err)
      } else {
        setStatus.reset()
      }

      return data
    }
  }

  const methods: AxiosMethods = useMemo(() => {
    const wrapped: any = {}
    for (let key in coreMethods) {
      // @ts-ignore
      wrapped[key] = wrapWithHook(coreMethods[key])
    }
    return wrapped
  }, [])

  return useMemo(() => {
    apiHookConfig?.keepData || delete status.data
    return { status, setStatus, methods, ...status, ...methods }
  }, [status, apiHookConfig?.keepData])
}
export default useApiCore
