import { useMemo } from 'react'
import useStatus from './useStatus.js'
import { RootMethods } from '../creator/createRoot.js'
import createHook, { CreateHookConfig } from '../creator/createHook.js'

export type ApiCoreConfig = {
  startAsLoading?: boolean
  hook?: CreateHookConfig
}

export default (rootMethods: RootMethods, config: ApiCoreConfig = {}) => {
  const [status, setStatus] = useStatus(config.startAsLoading)

  const methods = useMemo(() => {
    return createHook(rootMethods, setStatus, config.hook)
  }, [])

  return useMemo(() => ({ status, setStatus, methods }), [status])
}
