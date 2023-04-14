import {
  CoreRequestsResult,
  ExtractDataAsList,
  ExtractErrorAsList,
  ParamsAndOnLoad,
  RequestsInput,
  RootMethods,
} from './types'
import { getPramsAndOnLoad } from './utils'
import useApi from './core/useApi'
import useApiOnce from './core/useApiOnce'
import useSuspenseApi from './core/useSuspenseApi'

export default (rootMethods: RootMethods) => {
  return {
    useApi<TError>({ suspense = false } = {}) {
      return useApi<never, TError>(rootMethods, { suspense })
    },

    useDataApi<TData, TError>({ suspense = false } = {}) {
      return useApi<TData, TError>(rootMethods, { suspense, useData: true })
    },

    useApiOnce<T extends RequestsInput[]>(...args: ParamsAndOnLoad<T>) {
      type TData = ExtractDataAsList<T>
      type TError = ExtractErrorAsList<T>

      const [params, onLoad] = getPramsAndOnLoad(args)
      return useApiOnce<TData, TError>(rootMethods, params, onLoad)
    },

    createSuspense({ cache = false } = {}) {
      const store = { cache }
      const useSuspense: UseSuspense = (...args) => {
        const [params, onLoad] = getPramsAndOnLoad(args)
        return useSuspenseApi(store, rootMethods.requests, params, onLoad)
      }

      type UseSuspense = <T extends RequestsInput[]>(
        ...args: ParamsAndOnLoad<T>
      ) => CoreRequestsResult<T>

      return useSuspense
    },
  }
}
