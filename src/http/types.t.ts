import {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  CreateAxiosDefaults,
} from 'axios'
import { Prettify } from '../types'

export type HTTPOptionsInternal = {
  formatData(res: AxiosResponse): unknown
  formatError(err: AxiosError): unknown
}
export type HTTPOptions = Prettify<
  CreateAxiosDefaults & Partial<HTTPOptionsInternal>
>

export type HTTPCoreResult<TData, TError> = {
  ok?: boolean
  data?: TData
  error?: TError
  statusCode?: number
  response?: AxiosResponse<TData>
  axiosError?: AxiosError<TData>
}

export type MultipleRequestConfigInput = [
  TData: unknown,
  TError?: unknown,
  TBody?: unknown
]

export type HTTPMethodSingleResult<TData, TError> = Promise<
  HTTPCoreResult<TData, TError>
>

export type HTTPMethodMultipleResult<
  TInput extends MultipleRequestConfigInput[]
> = Promise<{
  [I in keyof TInput]: HTTPCoreResult<TInput[I][0], TInput[I][1]>
}>

export type HTTPBaseMethods = {
  requests<TInput extends MultipleRequestConfigInput[]>(
    ...args: {
      [I in keyof TInput]: AxiosRequestConfig<TInput[I][2]>
    }
  ): HTTPMethodMultipleResult<TInput>

  request<TData = unknown, TError = unknown, TBody = unknown>(
    config: AxiosRequestConfig<TBody>
  ): HTTPMethodSingleResult<TData, TError>

  get<TData = unknown, TError = unknown, TBody = unknown>(
    url: string,
    config?: AxiosRequestConfig<TBody>
  ): HTTPMethodSingleResult<TData, TError>

  delete<TData = unknown, TError = unknown, TBody = unknown>(
    url: string,
    config?: AxiosRequestConfig<TBody>
  ): HTTPMethodSingleResult<TData, TError>

  head<TData = unknown, TError = unknown, TBody = unknown>(
    url: string,
    config?: AxiosRequestConfig<TBody>
  ): HTTPMethodSingleResult<TData, TError>

  options<TData = unknown, TError = unknown, TBody = unknown>(
    url: string,
    config?: AxiosRequestConfig<TBody>
  ): HTTPMethodSingleResult<TData, TError>

  post<TData = unknown, TError = unknown, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig<TBody>
  ): HTTPMethodSingleResult<TData, TError>

  put<TData = unknown, TError = unknown, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig<TBody>
  ): HTTPMethodSingleResult<TData, TError>

  patch<TData = unknown, TError = unknown, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig<TBody>
  ): HTTPMethodSingleResult<TData, TError>
}

export type AxiosMultipleRequestParam<
  TInput extends MultipleRequestConfigInput[]
> = {
  [I in keyof TInput]: AxiosRequestConfig<TInput[I][2]>
}

export type AxiosRequestsConfig<T extends any[]> =
  | AxiosMultipleRequestParam<T>
  | [
      ...AxiosMultipleRequestParam<T>,
      (responses: Awaited<HTTPMethodMultipleResult<T>>) => void
    ]
