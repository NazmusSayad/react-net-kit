export const anchorSymbol = Symbol('Symbol')

export type CreateAnchor = {
  symbol: Symbol
  [index: string]: any
}

export const createAnchor = (): CreateAnchor => {
  return { symbol: anchorSymbol }
}

export const parseResponseList = (result: [any, any, boolean][]) => {
  return result.map(([error, data, ok]) => {
    return { error, data, ok }
  })
}

export const getLastFunction = (list: any[]): any => {
  const newList = [...list]
  const onLoad: any =
    newList[list.length - 1] instanceof Function && newList.pop()
  return [newList, onLoad]
}
