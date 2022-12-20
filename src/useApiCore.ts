import { useMemo } from 'react'
import { AxiosMethods } from './config'
import useStatus from './useStatus'

type ApiCoreConfigRequired = {
  startAsLoading: boolean
  useDataStatus: boolean
}

export type ApiCoreConfig = Partial<ApiCoreConfigRequired>

const useApiCore = (
  coreMethods: AxiosMethods,
  apiCoreConfig: ApiCoreConfig = {}
) => {
  const [status, setStatus] = useStatus(apiCoreConfig.startAsLoading)

  const wrapWithHook = (methodFn: Function) => {
    return async (...args: any[]) => {
      setStatus.loading()
      const [err, data] = await methodFn(...args)

      if (apiCoreConfig.useDataStatus && data !== undefined) {
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
    return { methods, ...status, ...methods, status, setStatus }
  }, [status])
}
export default useApiCore
