import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { allMethodsKeys, axiosMethodsKeys } from './config'

export interface ApiConfig {
  _getSuccess(response: AxiosResponse): any
  getSuccess(response: AxiosResponse): any
  _getFail(err: AxiosError): void
  getFail(err: AxiosError): void
}

export interface WsConfig {
  checkData(res: unknown): boolean
  formatData(res: unknown): any
  formatError(res: unknown): any
}

/* Root Types */
export type AxiosMethodsKeys = typeof axiosMethodsKeys[number]
export type AllMethodsKeys = typeof allMethodsKeys[number]
export type RequestsInput = [data: any, error?: any, body?: any]

/* Output Types */
export interface CoreResult<TData = any, TError = any> {
  ok: boolean
  data: TData
  error: TError
}

/* normal method */
export type MethodSingleResult<T extends RequestsInput> = Promise<
  CoreResult<
    UseIfExists<ExtractData<T>, unknown>,
    UseIfExists<ExtractError<T>, unknown>
  >
>

/* requests method */
export type CoreRequestsResult<T extends RequestsInput[]> = {
  [I in keyof T]: CoreResult<
    UseIfExists<ExtractData<T[I]>, unknown>,
    UseIfExists<ExtractError<T[I]>, unknown>
  >
}

export type MethodRequestsResult<T extends RequestsInput[]> = Promise<
  CoreRequestsResult<T>
>
export type MethodRequestsParams<T extends RequestsInput[]> = {
  [I in keyof T]: AxiosRequestConfig<ExtractBody<T[I]>>
}

/* Axios Wrapper Types */
export type RootMethods = {
  requests<T extends RequestsInput[]>(
    ...args: MethodRequestsParams<T>
  ): MethodRequestsResult<T>

  request<T extends RequestsInput>(
    config: AxiosRequestConfig<ExtractBody<T>>
  ): MethodSingleResult<T>

  get<T extends RequestsInput>(
    url: string,
    config?: AxiosRequestConfig<ExtractBody<T>>
  ): MethodSingleResult<T>

  delete<T extends RequestsInput>(
    url: string,
    config?: AxiosRequestConfig<ExtractBody<T>>
  ): MethodSingleResult<T>

  head<T extends RequestsInput>(
    url: string,
    config?: AxiosRequestConfig<ExtractBody<T>>
  ): MethodSingleResult<T>

  options<T extends RequestsInput>(
    url: string,
    config?: AxiosRequestConfig<ExtractBody<T>>
  ): MethodSingleResult<T>

  post<T extends RequestsInput>(
    url: string,
    data?: ExtractBody<T>,
    config?: AxiosRequestConfig<ExtractBody<T>>
  ): MethodSingleResult<T>

  put<T extends RequestsInput>(
    url: string,
    data?: ExtractBody<T>,
    config?: AxiosRequestConfig<ExtractBody<T>>
  ): MethodSingleResult<T>

  patch<T extends RequestsInput>(
    url: string,
    data?: ExtractBody<T>,
    config?: AxiosRequestConfig<ExtractBody<T>>
  ): MethodSingleResult<T>
}

/* UseApiOnce and UseSuspense api helpers */
type AxiosRequestsConfig<T extends any[]> = {
  [I in keyof T]: AxiosRequestConfig<T[I]>
}

export type ParamsAndOnLoad<Input extends RequestsInput[]> =
  | AxiosRequestsConfig<ExtractBodyAsList<Input>>
  | [
      ...AxiosRequestsConfig<ExtractBodyAsList<Input>>,
      (response: CoreRequestsResult<Input>) => void
    ]

/* Extraction */
type ExtractData<T extends RequestsInput> = T[0]
type ExtractError<T extends RequestsInput> = T[1]
type ExtractBody<T extends RequestsInput> = T[2]

export type ExtractDataAsList<T extends RequestsInput[]> = {
  [I in keyof T]: ExtractData<T[I]>
}
export type ExtractErrorAsList<T extends RequestsInput[]> = {
  [I in keyof T]: ExtractError<T[I]>
}
export type ExtractBodyAsList<T extends RequestsInput[]> = {
  [I in keyof T]: ExtractBody<T[I]>
}

/* Utils Types */
type UseIfExists<Target, R = any> = Target extends undefined ? R : Target
