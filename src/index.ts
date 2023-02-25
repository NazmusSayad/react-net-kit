import ReactApi from './ReactApi.js'
import useAbortSignal from './hooks/useAbortSignal.js'

import {
  UseApiParams,
  UseApiOnceParams,
  UseSuspenseApiParams,
  CreateSuspenseApiParams,
} from './hooks/index.js'
import { StatusMethods, StatusProps } from './heplers/useStatus.js'
import { AxiosMethodsKeys as AvailableMethodsString } from './config.js'
import { HookMethods as AvailableMethods } from './creator/createHook.js'
import { CreateRootConfig as ReactApiConfig } from './creator/createRoot.js'

export default ReactApi
export {
  useAbortSignal,

  // Types
  UseApiParams,
  UseApiOnceParams,
  UseSuspenseApiParams,
  CreateSuspenseApiParams,
  StatusProps,
  StatusMethods,
  AvailableMethodsString,
  AvailableMethods,
  ReactApiConfig,
}
