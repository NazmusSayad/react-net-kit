import {
  UseWsHookOptions,
  WsOptionsInternal,
  WsExtractMultipleResult,
} from './types.t'
import useWs from './core/useWsStatus'
import { Socket } from 'socket.io-client'
import { wsDefaultConfig } from '../config'
import createWsMethods from './createWsMethods'
import { Prettify } from '../types'

export default <O extends Partial<WsOptionsInternal>>(
  socket: Socket,
  options?: O
) => {
  type FallBack = Prettify<
    (undefined extends O['formatData']
      ? {}
      : { data: ReturnType<Exclude<O['formatData'], undefined>> }) &
      (undefined extends O['formatError']
        ? {}
        : { error: ReturnType<Exclude<O['formatError'], undefined>> })
  >

  const conf = { ...(options ?? {}), ...wsDefaultConfig }
  const methods = createWsMethods<FallBack>(socket, conf)

  return {
    methods,

    useWs<T extends {}[]>({
      suspense = false,
    }: Partial<UseWsHookOptions> = {}) {
      return useWs<
        {
          ok: boolean
          responses: Awaited<WsExtractMultipleResult<T, FallBack>>
        },
        typeof methods
      >(methods, { ...conf, suspense, startAsLoading: false })
    },
  }
}
