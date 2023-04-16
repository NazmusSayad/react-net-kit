import { Socket } from 'socket.io-client'
import useMemoOnce from '../helpers/useMemoOnce'
import useStatus from '../helpers/useStatus'
import useSuspense from '../helpers/useSuspense'
import { MethodRequestsResult, MethodSingleResult, WsConfig } from '../types'
import { getDataAndErrorList } from '../utils'

type WsConfigExtended = WsConfig & { suspense: boolean; saveData?: boolean }
export default <TData, TError>(socket: Socket, conf: WsConfigExtended) => {
  const [status, setStatus] = useStatus<TData, TError>()
  useSuspense(conf.suspense && status.loading)

  const socketEmmiter = useMemoOnce(
    () =>
      <T extends [data: any, error?: any][], U extends any[]>(
        event: string,
        ...args: U
      ): MethodRequestsResult<T> => {
        setStatus.loading()

        return new Promise((resolve) => {
          socket.emit(event, ...args, (...rawResponses: unknown[]) => {
            const result = rawResponses.map((res) => {
              const ok = conf.checkData(res)
              return {
                ok,
                data: ok ? conf.formatData(res) : undefined,
                error: ok ? undefined : conf.formatError(res),
              }
            })

            resolve(result as any)
            const [dataList, errorList] = getDataAndErrorList(result)
            conf.saveData
              ? setStatus.raw(dataList as any, errorList as any)
              : setStatus.error(errorList as any)
          })
        })
      }
  )

  const socketEmmiterOne = useMemoOnce(
    () =>
      <T extends [data: any, error?: any], U extends any[]>(
        event: string,
        ...args: U
      ): MethodSingleResult<T> => {
        setStatus.loading()

        return new Promise((resolve) => {
          socket.emit(event, ...args, (res: unknown) => {
            if (!res) return
            const ok = conf.checkData(res)
            const result = {
              data: ok ? conf.formatData(res) : undefined,
              error: ok ? undefined : conf.formatError(res),
              ok,
            }

            resolve(result)
            if (ok) {
              conf.saveData
                ? setStatus.data(result.data)
                : setStatus.loading(false)
            } else setStatus.error(result.error)
          })
        })
      }
  )

  return {
    ...status,
    status,
    setStatus,
    emit: socketEmmiterOne,
    emitAll: socketEmmiter,
  }
}
