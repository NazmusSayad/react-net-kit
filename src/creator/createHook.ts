import { StatusMethods } from '../hooks/useStatus.js'
import { AnyRootMethod, RootMethods } from './createRoot.js'
import { UseFunctionParams } from '../utils.js'

export type CreateHookConfig = {
  useDataStatus?: boolean
}

export type HookMethods = {
  [Key in keyof RootMethods]: UseFunctionParams<RootMethods[Key], Promise<any>>
}

const defaultConfig: CreateHookConfig = {
  useDataStatus: false,
}

const runHook = async <Fn extends AnyRootMethod>(
  instanceFn: Fn,
  setStatus: StatusMethods,
  config: CreateHookConfig,
  axiosArgs: Parameters<Fn>
): Promise<any> => {
  setStatus.loading()

  // @ts-ignore
  const [err, data, ok] = await instanceFn(...axiosArgs)

  if (ok) {
    config.useDataStatus ? setStatus.data(data) : setStatus.reset()
  } else setStatus.error(err)

  return data
}

export default (
  rootMethods: RootMethods,
  setStatus: StatusMethods,
  config: CreateHookConfig = {}
): HookMethods => {
  const conf = { ...defaultConfig, ...config }
  const hookMethods: any = {}

  for (let key in rootMethods) {
    // @ts-ignore
    const instanceFn: AnyRootMethod = rootMethods[key]

    hookMethods[key] = (...axiosArgs: Parameters<AnyRootMethod>) => {
      return runHook(instanceFn, setStatus, conf, axiosArgs)
    }
  }

  return hookMethods
}
