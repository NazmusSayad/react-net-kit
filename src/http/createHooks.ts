import {
  HTTPBaseMethods,
  AxiosRequestsConfig,
  HTTPMethodSingleResult,
  HTTPMethodMultipleResult,
  MultipleRequestConfigInput,
} from './types.t'
import useApi from './core/useApi'
import useApiOnce from './core/useApiOnce'
import { getPramsAndOnLoad } from '../utils'
import useSuspenseApi from './core/useSuspenseApi'

export default <Base extends HTTPBaseMethods>(rootMethods: Base) => {
  type OutputSingle<TData, TError> = Awaited<
    HTTPMethodSingleResult<TData, TError>
  >
  type OutputMultiple<T extends MultipleRequestConfigInput[]> = Awaited<
    HTTPMethodMultipleResult<T>
  >

  return {
    useApi<
      T extends MultipleRequestConfigInput,
      TS extends MultipleRequestConfigInput[] = T[]
    >({ suspense = false } = {}) {
      type Output = {
        response?: OutputSingle<T[0], T[1]>
        responses?: OutputMultiple<TS>
      }

      return useApi<Base, Output>(rootMethods, { suspense })
    },

    useApiOnce<T extends MultipleRequestConfigInput[]>(
      ...args: AxiosRequestsConfig<T>
    ) {
      const [params, onLoad] = getPramsAndOnLoad(args)
      return useApiOnce<Base, { responses?: OutputMultiple<T> }>(
        rootMethods,
        params,
        onLoad
      )
    },

    createSuspense({ cache = false } = {}) {
      const store = { cache }

      return function <T extends MultipleRequestConfigInput[]>(
        ...args: AxiosRequestsConfig<T>
      ) {
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
