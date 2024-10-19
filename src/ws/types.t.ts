import createWsMethods from './createWsMethods'

export type WsOptionsInternal = {
  checkData(res: unknown): boolean
  formatData(res: unknown): any
  formatError(res: unknown): any
}

export type UseWsHookOptions = {
  suspense: boolean
}

export type UseWsOptionsInternal = UseWsHookOptions & {
  startAsLoading: boolean
}

export type WsRequestConfig<D = unknown, E = unknown> = {
  data?: D
  error?: E
  res?: unknown
}

export type WsCoreResult<T extends WsRequestConfig> = {
  ok: boolean
  res: T['res']
  data: T['data']
  error: T['error']
}

export type WsExtractMultipleResult<T extends WsRequestConfig[]> = Promise<{
  [K in keyof T]: WsCoreResult<T[K]>
}>

export type WsBaseMethods = ReturnType<typeof createWsMethods>
