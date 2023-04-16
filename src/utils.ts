import { CoreResult } from './types'

export const isSame = (a: any, b: any): boolean => {
  return a === b || JSON.stringify(a) === JSON.stringify(b)
}

export const getPramsAndOnLoad = (params: any[]) => {
  return params.at(-1) instanceof Function
    ? [params.slice(0, -1), params.at(-1)]
    : [params]
}

export const getDataAndErrorList = (
  responses: CoreResult[]
): [dataList: any[], errorList: any[]] => {
  const dataList = []
  const errorList = []

  for (let res of responses) {
    dataList.push(res.data)
    errorList.push(res.error)
  }

  return [dataList, errorList]
}
