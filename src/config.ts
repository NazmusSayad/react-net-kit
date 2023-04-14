export const axiosMethodsKeys = [
  'request',
  'get',
  'delete',
  'head',
  'options',
  'post',
  'put',
  'patch',
] as const

export const axiosMethodsKeysUp = [
  'REQUEST',
  'GET',
  'DELETE',
  'HEAD',
  'OPTIONS',
  'POST',
  'PUT',
  'PATCH',
] as const

export const allMethodsKeys = ['requests', ...axiosMethodsKeys] as const
export const allMethodsKeysUp = ['REQUESTS', ...axiosMethodsKeysUp] as const

export const defaultConfig = {
  _getSuccess: () => {},
  getSuccess: (response: any) => {
    return response.status === 204 ? true : response.data?.data ?? response.data
  },

  _getFail: () => {},
  getFail: (err: any): String | String[] => {
    return err.response?.data?.message ?? err.message
  },
}
