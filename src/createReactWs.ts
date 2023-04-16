import { Socket } from 'socket.io-client'
import { wsDefaultOptions } from './config'
import useWs from './core/useWs'
import { WsConfig } from './types'

export default (socket: Socket, options: Partial<WsConfig> = {}) => {
  const conf = { ...options, ...wsDefaultOptions }

  return {
    useWs<TError>({ suspense = false } = {}) {
      return useWs<never, TError>(socket, { ...conf, suspense })
    },
    useDataWs<TData, TError>({ suspense = false } = {}) {
      return useWs<TData, TError>(socket, { ...conf, suspense, saveData: true })
    },
  }
}
