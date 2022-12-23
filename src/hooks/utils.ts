export const anchorSymbol = Symbol('useSuspenseApi')

export type CreateAnchor = {
  symbol: Symbol
  response?: any
}

export const createAnchor = (): CreateAnchor => {
  return {
    symbol: anchorSymbol,
  }
}

export const parseResponseList = (result: [any, any, boolean][]) => {
  return result.map(([error, data, ok]) => {
    return { error, data, ok }
  })
}

export const getLastFunction = (list: any[]) => {
  const newList = [...list]
  const onLoad: any =
    newList[list.length - 1] instanceof Function && newList.pop()
  return [newList, onLoad]
}
