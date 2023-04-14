import {
  AllMethodsKeys,
  ExtractData,
  ExtractError,
  ListInput,
  OutputFromListInput,
  ParamsWithOnLoadFn,
  RootMethods,
} from './types'
import { getPramsAndOnLoad } from './utils'
import useApi from './core/useApi'
import useApiOnce from './core/useApiOnce'
import useSuspenseApi from './core/useSuspenseApi'

export default (rootMethods: RootMethods) => {
  return {
    useApi<Error>({ suspense = false } = {}) {
      return useApi<never, Error>(rootMethods, { suspense })
    },

    useApiOnce<Input extends ListInput<M>, M extends AllMethodsKeys>(
      method: M,
      ...args: ParamsWithOnLoadFn<M, Input>
    ) {
      type TData = M extends 'requests' ? ExtractData<Input> : Input[0]
      type TError = M extends 'requests' ? ExtractError<Input> : Input[1]

      const [params, onLoad] = getPramsAndOnLoad(args)
      return useApiOnce<TData, TError>(rootMethods, method, params, onLoad)
    },

    createUseSuspense({ cache = false } = {}) {
      const store = { cache }

      const suspenseFn: FN = (method, ...args) => {
        const [params, onLoad] = getPramsAndOnLoad(args)
        return useSuspenseApi(store, rootMethods[method], params, onLoad)
      }

      type FN = <Input extends ListInput<M>, M extends AllMethodsKeys>(
        method: M,
        ...args: ParamsWithOnLoadFn<M, Input>
      ) => OutputFromListInput<M, Input>

      return suspenseFn
    },
  }
}
