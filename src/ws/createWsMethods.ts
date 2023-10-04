import { WsOptionsInternal, WsExtractMultipleResult } from './types.t'
import { Socket } from 'socket.io-client'

export default function <FallBack extends {}>(
  socket: Socket,
  options: WsOptionsInternal
) {
  return {
    emit<U extends any[]>(event: string, ...args: U) {
      return socket.emit(event, ...args)
    },

    send<T extends {}[], U extends any[]>(
      event: string,
      ...args: U
    ): WsExtractMultipleResult<T, FallBack> {
      return new Promise((resolve) => {
        socket.emit(event, ...args, (...rawResponses: unknown[]) => {
          const responses = rawResponses.map((res) => {
            const ok = options.checkData(res)
            return {
              ok,
              res,
              data: ok ? options.formatData(res) : undefined,
              error: ok ? undefined : options.formatError(res),
            }
          })

          resolve(responses as any)
        })
      })
    },
  }
}
