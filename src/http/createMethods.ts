import { AxiosError, AxiosInstance } from 'axios'
import { axiosMethodKeys } from '../config'
import { HTTPBaseMethods, HTTPCoreResult, HTTPOptionsInternal } from './types.t'

const runAxiosCore = async (
  fn: Function,
  params: any,
  config: HTTPOptionsInternal
): Promise<HTTPCoreResult<unknown, unknown>> => {
  try {
    const res = await fn(...params)

    return {
      ok: true,
      response: res,
      statusCode: res.status,
      data: config.formatData(res),
      error: undefined,
    }
  } catch (err) {
    const error = err as AxiosError

    return {
      ok: false,
      axiosError: error,
      statusCode: error.response!.status,
      response: error.response!,
      error: config.formatError(error),
      data: undefined,
    }
  }
}

const axiosSingleRequestWrapper = (
  fn: Function,
  config: HTTPOptionsInternal
) => {
  return (...params: any) => runAxiosCore(fn, params, config)
}

const axiosMultipleRequestWrapper = (
  fn: Function,
  config: HTTPOptionsInternal
) => {
  return (...requests: any[]) => {
    const promises = requests.map((params) =>
      runAxiosCore(fn, [params], config)
    )
    return Promise.all(promises)
  }
}

export default (axios: AxiosInstance, config: HTTPOptionsInternal) => {
  const methods: any = {}
  for (let key in axios) {
    if (!axiosMethodKeys.includes(key as any)) continue

    const wrapped = axiosSingleRequestWrapper((axios as any)[key], config)
    methods[key] = wrapped
  }

  methods.requests = axiosMultipleRequestWrapper(axios.request, config)
  return methods as HTTPBaseMethods
}
