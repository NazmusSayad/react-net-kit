import axios, { CreateAxiosDefaults } from 'axios'
import createHooks from './createHooks'
import createMethods from './createMethods'
import { ApiConfig } from './types'

const ReactApi = (axiosConfig?: CreateAxiosDefaults, config?: ApiConfig) => {
  const axiosInstance = axios.create(axiosConfig)
  const methods = createMethods(axiosInstance, config ?? {})
  const hooks = createHooks(methods)

  return { axiosInstance, methods, hooks }
}

export default ReactApi
