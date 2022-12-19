export const runSyncAsync = async (fn: Function | any, ...args: any[]) => {
  if (!(fn instanceof Function)) return

  const rv = fn(...args)
  if (rv instanceof Promise) return await rv
  return rv
}
