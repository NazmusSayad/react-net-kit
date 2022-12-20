export const runSyncAsync = async (fn: Function | any, ...args: any[]) => {
  if (!(fn instanceof Function)) return

  const rv = fn(...args)
  if (rv instanceof Promise) return await rv
  return rv
}

export const isSame = (a: any, b: any): boolean => {
  return a === b || JSON.stringify(a) === JSON.stringify(b)
}
