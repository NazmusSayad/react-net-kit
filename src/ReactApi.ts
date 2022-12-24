import axios, { CreateAxiosDefaults } from 'axios'
import createRoot, { CreateRootConfig } from './creator/createRoot.js'
import getHooks from './hooks/index.js'

const ReactApi = (
  axiosConfig?: CreateAxiosDefaults,
  createRootConfig?: CreateRootConfig
) => {
  const instance = axios.create(axiosConfig)
  const rootMethods = createRoot(instance, createRootConfig)
  const hooks = getHooks(rootMethods)

  return {
    instance,
    methods: rootMethods,
    ...hooks,
  }
}

export default ReactApi
