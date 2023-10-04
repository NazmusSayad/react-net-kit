export const getPramsAndOnLoad = (params: any[]) => {
  return params[params.length - 1] instanceof Function
    ? [params.slice(0, -1), params[params.length - 1]]
    : [params]
}
