export const runSyncAsync = async (fn: Function | any, ...args: any[]) => {
  if (!(fn instanceof Function)) return

  const rv = fn(...args)
  if (rv instanceof Promise) return await rv
  return rv
}

export const isSame = (a: any, b: any): boolean => {
  return a === b || JSON.stringify(a) === JSON.stringify(b)
}

export type UseFunctionParams<F extends (...args: any[]) => any, R> = (
  ...args: Parameters<F>
) => R

export const defaultGetSuccess = (response: any): any => {
  return response.status === 204 ? true : response.data?.data || response.data
}

export const defaultGetFail = (err: any): String | String[] => {
  return err.response?.data?.message || err.message
}
