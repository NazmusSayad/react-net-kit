import { CoreResult, RootMethods } from '../types'
import { getDataAndErrorList } from '../utils'
import { DemoStatusMethods } from '../helpers/useStatus'

export default (
  methods: any,
  setStatus: DemoStatusMethods,
  useData = false
) => {
  const result: any = {}

  const handleNormalRequest = (res: CoreResult) => {
    const { data, error, ok } = res
    if (ok) {
      useData ? setStatus.data(data) : setStatus.loading(false)
    } else {
      setStatus.error(error)
    }
    return res
  }

  const handleRequests = (res: CoreResult[]) => {
    const [dataList, errorList] = getDataAndErrorList(res)
    useData ? setStatus.raw(dataList, errorList) : setStatus.error(errorList)
    return [...res]
  }

  for (let key in methods) {
    const axiosWrappedFn = async (...args: any[]) => {
      setStatus.loading()
      const axiosFn = methods[key]
      const res = await axiosFn(...args)

      return res instanceof Array
        ? handleRequests(res)
        : handleNormalRequest(res)
    }

    result[key] = axiosWrappedFn
  }

  return result as RootMethods
}
