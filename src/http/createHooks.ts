import {
  HTTPBaseMethods,
  HTTPRequestConfig,
  AxiosRequestsConfig,
  HTTPMethodSingleResult,
  HTTPMethodMultipleResult,
} from './types.t'
import useApi from './core/useApi'
import useApiOnce from './core/useApiOnce'
import { getPramsAndOnLoad } from '../utils'
import useSuspenseApi from './core/useSuspenseApi'

export default <Base extends HTTPBaseMethods, F extends {}>(
  rootMethods: Base
) => {
  type OutputSingle<T extends object> = Awaited<HTTPMethodSingleResult<T, F>>
  type OutputMultiple<T extends HTTPRequestConfig[]> = Awaited<
    HTTPMethodMultipleResult<T, F>
  >

  return {
    useApi<T extends object, TS extends object[] = T[]>({
      suspense = false,
    } = {}) {
      type Output = {
        response?: OutputSingle<T>
        responses?: OutputMultiple<TS>
      }

      return useApi<Base, Output>(rootMethods, { suspense })
    },

    useApiOnce<T extends object[]>(...args: AxiosRequestsConfig<T, F>) {
      const [params, onLoad] = getPramsAndOnLoad(args)
      return useApiOnce<Base, { responses?: OutputMultiple<T> }>(
        rootMethods,
        params,
        onLoad
      )
    },

    createSuspense({ cache = false } = {}) {
      const store = { cache }

      return function <T extends object[]>(...args: AxiosRequestsConfig<T, F>) {
        const [params, onLoad] = getPramsAndOnLoad(args)

        return useSuspenseApi<Base, OutputMultiple<T>>(
          rootMethods.requests,
          store,
          params,
          onLoad
        )
      }
    },
  }
}
