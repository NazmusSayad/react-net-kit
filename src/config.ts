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

export const allMethodsKeys = ['requests', ...axiosMethodsKeys] as const

export const apiDefaultConfig = {
  _getSuccess: () => {},
  getSuccess: (response: any) => {
    return response.status === 204 ? true : response.data?.data ?? response.data
  },

  _getFail: () => {},
  getFail: (err: any): String | String[] => {
    return err.response?.data?.message ?? err.message
  },
}

export const wsDefaultOptions = {
  checkData(res: { status: string }) {
    return res.status ? res.status === 'success' : true
  },
  formatData(res: { data: any }) {
    return res.data ?? res
  },
  formatError(res: { message: any }) {
    return res.message ?? res
  },
}
