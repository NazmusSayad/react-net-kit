import {
  WsBaseMethods,
  WsOptionsInternal,
  UseWsOptionsInternal,
} from '../types.t'
import { useMemo } from 'react'
import useStatus from '../../hooks/useStatus'
import useSuspense from '../../hooks/useSuspense'
import useMemoOnce from '../../hooks/useMemoOnce'

export default function <
  T extends Record<string, any>,
  Base extends WsBaseMethods
>(methods: Base, conf: WsOptionsInternal & UseWsOptionsInternal) {
  const status = useStatus<T>()
  useSuspense(conf.suspense && status.loading)

  const internalMethods = useMemoOnce(function () {
    const result: Record<string, any> = {}

    for (let key in methods) {
      const method = methods[key as keyof typeof methods] as Function
      result[key] = async function (...args: any[]) {
        try {
          const res = await method(...args)
          if (conf.checkData(res)) return conf.formatData(res)
          throw res
        } catch (err) {
          return conf.formatError(err)
        }
      }
    }

    return result as Base
  })

  return useMemo(
    () => ({ ...status, ...internalMethods, status, methods: internalMethods }),
    [status]
  )
}
