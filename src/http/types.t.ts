import {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  CreateAxiosDefaults,
} from 'axios'
import { MergeObject, Prettify } from '../types'

export type HTTPOptionsInternal = {
  formatData(res: AxiosResponse): unknown
  formatError(err: AxiosError): unknown
}
export type HTTPOptions = Prettify<
  CreateAxiosDefaults & Partial<HTTPOptionsInternal>
>

// Extract response data
export type HTTPRequestConfig<D = unknown, E = unknown> = {
  data?: D
  error?: E
  body?: unknown
}
export type HTTPCoreResult<T extends HTTPRequestConfig> = {
  ok?: boolean
  statusCode?: number
  response?: AxiosResponse<T['data']>
  data?: T['data']
  error?: T['error']
  axiosError?: AxiosError<T['data']>
}

export type HTTPMethodSingleResult<
  T extends HTTPRequestConfig,
  F extends {}
> = Promise<HTTPCoreResult<MergeObject<F, T>>>

export type HTTPMethodMultipleResult<
  T extends HTTPRequestConfig[],
  F extends {}
> = Promise<{
  [I in keyof T]: HTTPCoreResult<MergeObject<F, T[I]>>
}>

type ExtractBody<T> = 'body' extends keyof T ? T['body'] : unknown

export type HTTPBaseMethods<FallBack extends {} = {}> = {
  requests<T extends {}[]>(
    ...args: AxiosMultipleRequestParam<T>
  ): HTTPMethodMultipleResult<T, FallBack>

  request<T extends {}>(
    config: AxiosSingleRequestParam<T>
  ): HTTPMethodSingleResult<T, FallBack>

  get<T extends {}>(
    url: string,
    config?: AxiosSingleRequestParam<T>
  ): HTTPMethodSingleResult<T, FallBack>

  delete<T extends {}>(
    url: string,
    config?: AxiosSingleRequestParam<T>
  ): HTTPMethodSingleResult<T, FallBack>

  head<T extends {}>(
    url: string,
    config?: AxiosSingleRequestParam<T>
  ): HTTPMethodSingleResult<T, FallBack>

  options<T extends {}>(
    url: string,
    config?: AxiosSingleRequestParam<T>
  ): HTTPMethodSingleResult<T, FallBack>

  post<T extends {}>(
    url: string,
    data?: ExtractBody<T>,
    config?: AxiosSingleRequestParam<T>
  ): HTTPMethodSingleResult<T, FallBack>

  put<T extends {}>(
    url: string,
    data?: ExtractBody<T>,
    config?: AxiosSingleRequestParam<T>
  ): HTTPMethodSingleResult<T, FallBack>

  patch<T extends {}>(
    url: string,
    data?: ExtractBody<T>,
    config?: AxiosSingleRequestParam<T>
  ): HTTPMethodSingleResult<T, FallBack>
}

export type AxiosSingleRequestParam<T extends HTTPRequestConfig> =
  AxiosRequestConfig<T['body']>

export type AxiosMultipleRequestParam<T extends HTTPRequestConfig[]> = {
  [I in keyof T]: AxiosRequestConfig<T[I]['body']>
}

export type AxiosRequestsConfig<T extends any[], F extends {}> =
  | AxiosMultipleRequestParam<T>
  | [
      ...AxiosMultipleRequestParam<T>,
      (responses: Awaited<HTTPMethodMultipleResult<T, F>>) => void
    ]
