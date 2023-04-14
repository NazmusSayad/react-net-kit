import axios, { CreateAxiosDefaults } from 'axios'
import createHooks from './createHooks'
import createMethods from './createMethods'
import { ApiConfig } from './types'

const ReactApi = (axiosConfig?: CreateAxiosDefaults, config?: ApiConfig) => {
  const instance = axios.create(axiosConfig)
  const methods = createMethods(instance, config ?? {})
  const hooks = createHooks(methods)

  return { instance, methods, hooks }
}

export default ReactApi
