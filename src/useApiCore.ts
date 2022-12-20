import { useMemo } from 'react'
import { AnyWrappedMethod, WrappedMethods } from './wrapper'
import useStatus from './useStatus'
import { UseFunctionParams } from './utils'

type ApiCoreConfigRequired = {
  startAsLoading: boolean
  useDataStatus: boolean
}

export type ApiCoreConfig = Partial<ApiCoreConfigRequired>
type HookWrappedMethod<Func extends AnyWrappedMethod> = UseFunctionParams<
  Func,
  Promise<any>
>
export type HookWrappedMethods = {
  [Key in keyof WrappedMethods]: HookWrappedMethod<WrappedMethods[Key]>
}

const useApiCore = (
  coreMethods: WrappedMethods,
  apiCoreConfig: ApiCoreConfig = {}
) => {
  const [status, setStatus] = useStatus(apiCoreConfig.startAsLoading)

  const wrapWithHook = (wrappedFn: AnyWrappedMethod) => {
    return async (...args: any[]) => {
      setStatus.loading()
      const [err, data, ok] = await wrappedFn(...args)

      if (ok) {
        apiCoreConfig.useDataStatus ? setStatus.data(data) : setStatus.reset()
      } else setStatus.error(err)

      return data
    }
  }

  const methods: HookWrappedMethods = useMemo(() => {
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
