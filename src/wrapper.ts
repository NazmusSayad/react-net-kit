import { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { AxiosMethods, axiosMethods } from './config'
import { runSyncAsync } from './utils'

const defaultGetSuccess = (response: any): any => {
  return response.status === 204 ? true : response.data?.data || response.data
}

const defaultGetFail = (err: any): String | String[] => {
  return err.response?.data?.message || err.message
}

const defaultWrapperOptions = {
  _getSuccess: undefined,
  getSuccess: defaultGetSuccess,
  _getFail: undefined,
  getFail: defaultGetFail,
}

export type WrapperOptions = {
  getSuccess?: (response: AxiosResponse) => any
  _getSuccess?: (response: AxiosResponse) => any
  getFail?: (err: AxiosError) => void
  _getFail?: (err: AxiosError) => void
}

const wrapper = (
  axios: AxiosInstance,
  config: WrapperOptions = {}
): AxiosMethods => {
  const conf = { ...defaultWrapperOptions, ...config }

  const wrap =
    (axiosMethod: Function) =>
    async (...args: any[]) => {
      try {
        const response = await axiosMethod(...args)
        await runSyncAsync(conf._getSuccess, response)
        return [undefined, await runSyncAsync(conf.getSuccess, response)]
      } catch (err) {
        await runSyncAsync(conf._getFail, err)
        return [await runSyncAsync(conf.getFail, err), undefined]
      }
    }

  // @ts-ignore
  const wrappedMethods: AxiosMethods = { default: wrap(axios) }

  for (let key in axios) {
    if (!axiosMethods.includes(key)) continue
    // @ts-ignore
    wrappedMethods[key] = wrap(axios[key])
  }

  return wrappedMethods
}

export default wrapper
