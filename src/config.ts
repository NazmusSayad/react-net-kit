import { HTTPOptionsInternal } from './http/types.t'
import { WsOptionsInternal } from './ws/types.t'

export const axiosMethodKeys = [
  'request',
  'get',
  'delete',
  'head',
  'options',
  'post',
  'put',
  'patch',
] as const

export const httpMethodKeys = ['requests', ...axiosMethodKeys] as const

export const httpDefaultConfig: HTTPOptionsInternal = {
  formatData(res) {
    return res.data?.data ?? res.data
  },
  formatError(err: any) {
    return (
      err.response?.data?.error?.message ??
      err.response?.data?.message ??
      err.response?.data?.error ??
      err.message
    )
  },
}

export const wsDefaultConfig: WsOptionsInternal = {
  checkData(res) {
    return Boolean(res)
  },
  formatData(res) {
    return res
  },
  formatError(err: any) {
    return (
      err.response?.data?.error?.message ??
      err.response?.data?.message ??
      err.response?.data?.error ??
      err.message
    )
  },
}
