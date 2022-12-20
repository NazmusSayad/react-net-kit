import axios from 'axios'

export const axiosMethods = [
  'request',
  'get',
  'delete',
  'head',
  'options',
  'post',
  'put',
  'patch',
]

export type AxiosMethodsKeys =
  | 'default'
  | 'request'
  | 'get'
  | 'delete'
  | 'head'
  | 'options'
  | 'post'
  | 'put'
  | 'patch'

export type AxiosMethods = {
  default: typeof axios.options
  request: typeof axios.request
  get: typeof axios.get
  delete: typeof axios.delete
  head: typeof axios.head
  options: typeof axios.options
  post: typeof axios.post
  put: typeof axios.put
  patch: typeof axios.patch
}
