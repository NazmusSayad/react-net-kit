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
  const conf = { ...(options ?? {}), ...wsDefaultConfig }
  const methods = createWsMethods(socket, conf)

  return {
    methods,

    useWs<T extends {}[]>({
      suspense = false,
    }: Partial<UseWsHookOptions> = {}) {
      return useWs<
        {
          ok: boolean
          responses: Awaited<WsExtractMultipleResult<T>>
        },
        typeof methods
      >(methods, { ...conf, suspense, startAsLoading: false })
    },
  }
}
