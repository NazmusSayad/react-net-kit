import axios, { CreateAxiosDefaults } from 'axios'
import createRoot, { CreateRootConfig } from './creator/createRoot.js'
import createHooks from './hooks/index.js'

const ReactApi = (
  axiosConfig?: CreateAxiosDefaults,
  createRootConfig?: CreateRootConfig
) => {
  const instance = axios.create(axiosConfig)
  const rootMethods = createRoot(instance, createRootConfig)
  const hooks = createHooks(rootMethods)

  return {
    instance,
    methods: rootMethods,
    ...hooks,
  }
}

export default ReactApi
