import { AxiosInstance } from 'axios'
import { AxiosMethods, axiosMethods } from './config'
import { runSyncAsync } from './utils'

const defaultGetSuccess = (response: any): any => {
  return response.status === 204 ? true : response.data?.data || response.data
}

const defaultGetFail = (err: any): String | String[] => {
  return err.response?.data?.message || err.message
}

const defaultWrapperOptions = {
  getSuccess: defaultGetSuccess,
  successMiddleware: undefined,
  getFail: defaultGetFail,
  failMiddleware: undefined,
}

export type WrapperOptions = {
  getSuccess?: (response: any) => any
  successMiddleware?: (response: any) => any
  getFail?: (err: any) => any
  failMiddleware?: (err: any) => any
}

export default (
  axios: AxiosInstance,
  config?: WrapperOptions
): AxiosMethods => {
  const conf = { ...defaultWrapperOptions, ...config }

  const wrap =
    (axiosMethod: Function) =>
    async (...args: any[]) => {
      try {
        const response = await axiosMethod(...args)
        await runSyncAsync(conf.successMiddleware, response)
        return [undefined, await runSyncAsync(conf.getSuccess, response)]
      } catch (err) {
        await runSyncAsync(conf.failMiddleware, err)
        return [await runSyncAsync(conf.getFail, err), undefined]
      }
    }

  const wrappedMethods: any = { axios: wrap(axios) }

  for (let key in axios) {
    if (!axiosMethods.includes(key)) continue
    // @ts-ignore
    wrappedMethods[key] = wrap(axios[key])
  }

  return wrappedMethods
}
