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
