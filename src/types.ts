import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { allMethodsKeys, axiosMethodsKeys } from './config'

export interface ApiConfig {
  _getSuccess: (response: AxiosResponse) => any
  getSuccess: (response: AxiosResponse) => any
  _getFail: (err: AxiosError) => void
  getFail: (err: AxiosError) => void
}

/* Axios Types */
export type AxiosMethodsKeys = typeof axiosMethodsKeys[number]
export type AllMethodsKeys = typeof allMethodsKeys[number]

/* Axios Raw Types */
export type RawMethods = {
  [Key in keyof Record<AxiosMethodsKeys, any>]: typeof axios[Key]
}
export type AnyRawMethod = RawMethods[keyof RawMethods]
export type AnyRawMethodParams = Parameters<AnyRawMethod>

/* Output Types */
export interface CoreOutput<TData, TError> {
  ok: boolean
  data: TData
  error: TError
}

export type CoreOutputAny<TData = any, TError = any> = CoreOutput<TData, TError>

export type CoreRequestsOutput<T extends any[]> = {
  [I in keyof T]: CoreOutput<T[I][0], T[I][1] extends undefined ? any : T[I][1]>
}

/* Method return types */
export type MethodSingleOutput<TData, TError> = Promise<
  CoreOutput<TData, TError>
>

export type MethodRequestsOutput<T extends any[]> = Promise<
  CoreRequestsOutput<T>
>

export type MethodRequestsParams<T extends any[]> = {
  [I in keyof T]: AxiosRequestConfig<T[I][2]>
}

/* Axios Wrapper Types */
export type RootMethods = {
  requests<Input extends [data: any, error?: any, body?: any][]>(
    ...args: MethodRequestsParams<Input>
  ): MethodRequestsOutput<Input>

  request<Data = any, Error = any, Body = any>(
    config: AxiosRequestConfig<Body>
  ): MethodSingleOutput<Data, Error>

  get<Data = any, Error = any, Body = any>(
    url: string,
    config?: AxiosRequestConfig<Body>
  ): MethodSingleOutput<Data, Error>

  delete<Data = any, Error = any, Body = any>(
    url: string,
    config?: AxiosRequestConfig<Body>
  ): MethodSingleOutput<Data, Error>

  head<Data = any, Error = any, Body = any>(
    url: string,
    config?: AxiosRequestConfig<Body>
  ): MethodSingleOutput<Data, Error>

  options<Data = any, Error = any, Body = any>(
    url: string,
    config?: AxiosRequestConfig<Body>
  ): MethodSingleOutput<Data, Error>

  post<Data = any, Error = any, Body = any>(
    url: string,
    data?: Body,
    config?: AxiosRequestConfig<Body>
  ): MethodSingleOutput<Data, Error>

  put<Data = any, Error = any, Body = any>(
    url: string,
    data?: Body,
    config?: AxiosRequestConfig<Body>
  ): MethodSingleOutput<Data, Error>

  patch<Data = any, Error = any, Body = any>(
    url: string,
    data?: Body,
    config?: AxiosRequestConfig<Body>
  ): MethodSingleOutput<Data, Error>
}

export type AnyWrappedMethod = RootMethods[keyof RootMethods]

/* UseApiOnce and UseSuspense api helpers */
type OnLoadFn<TData> = (data: TData) => void
type ParamsWithOnLoadFnCore<
  M extends AllMethodsKeys,
  Data,
  Body
> = M extends 'requests'
  ? AxiosRequestConfig<Body>[] | [...AxiosRequestConfig<Body>[], OnLoadFn<Data>]
  : M extends 'request'
  ? [config: AxiosRequestConfig<Body>, onLoad?: OnLoadFn<Data>]
  : /* 2 */
  M extends 'get' | 'delete' | 'head' | 'options'
  ?
      | [url: string, onLoad?: OnLoadFn<Data>]
      | [
          url: string,
          config?: AxiosRequestConfig<Body>,
          onLoad?: OnLoadFn<Data>
        ]
  : /* 3 */
  M extends 'post' | 'put' | 'patch'
  ?
      | [url: string, onLoad?: OnLoadFn<Data>]
      | [url: string, data?: Body, onLoad?: OnLoadFn<Data>]
      | [
          url: string,
          data?: Body,
          config?: AxiosRequestConfig<Body>,
          onLoad?: OnLoadFn<Data>
        ]
  : null

export type ListInput<M> = M extends 'requests'
  ? [data: any, error?: any][]
  : [data: any, error?: any]

export type ParamsWithOnLoadFn<
  M extends AllMethodsKeys,
  Output extends any[]
> = ParamsWithOnLoadFnCore<
  M,
  M extends 'requests'
    ? CoreRequestsOutput<Output>
    : CoreOutput<Output[0], Output[1]>,
  unknown
>

export type OutputFromListInput<
  M extends AllMethodsKeys,
  Input extends any[]
> = M extends 'requests'
  ? CoreRequestsOutput<Input>
  : CoreOutput<Input[0], Input[1]>

export type ExtractData<T extends any[]> = {
  [I in keyof T]: T[I][0]
}

export type ExtractError<T extends any[]> = {
  [I in keyof T]: T[I][1]
}

export type ExtractBody<T extends any[]> = {
  [I in keyof T]: T[I][2]
}
