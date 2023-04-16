import { AxiosInstance } from 'axios'
import { ApiConfig, RootMethods } from './types'
import { axiosMethodsKeys, apiDefaultConfig } from './config'

const runAxiosMethod = async (fn: Function, params: any, config: ApiConfig) => {
  try {
    const res = await fn(...params)
    config._getSuccess(res)
    return { data: config.getSuccess(res), ok: true, error: undefined }
  } catch (err) {
    config._getFail(err as any)
    return { error: config.getFail(err as any), ok: false, data: undefined }
  }
}

const axiosRequestsWrapper = (fn: Function, config: ApiConfig) => {
  return (...requests: any[]) => {
    const promises = requests.map((params) =>
      runAxiosMethod(fn, [params], config)
    )
    return Promise.all(promises)
  }
}

const axiosMethodWrapper = (fn: Function, config: ApiConfig) => {
  return (...params: any) => runAxiosMethod(fn, params, config)
}

export default (axios: AxiosInstance, inputConfig: Partial<ApiConfig>) => {
  const config = { ...apiDefaultConfig, ...inputConfig }

  const methods: any = {}
  for (let key in axios) {
    if (!axiosMethodsKeys.includes(key as any)) continue

    const wrapped = axiosMethodWrapper((axios as any)[key], config)
    methods[key] = wrapped
  }

  methods.requests = axiosRequestsWrapper(axios.request, config)
  return methods as RootMethods
}
