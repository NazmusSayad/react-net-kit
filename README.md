# use-react-api

This package makes http request in react easier.

<a href="https://npmjs.com/package/use-react-api">
  <img src="https://img.shields.io/npm/v/use-react-api" alt="npm package"> 
</a>

---

## Installation

- with npm

```shell
npm i use-react-api axios
```

- with yarn

```shell
yarn add use-react-api axios
```

- with pnpm

```shell
pnpm add use-react-api axios
```

<br/> <br/>

# Setup

Configure your application with whatever configuration you want.

## Basic Usage:

`/* api.js */`

```js
import ReactApi from 'use-react-api'

export default ReactApi()
```

<br />

`/* Compontnt.js */`

```js
import { useApiOnce } from './api.js'

const Component = () => {
  const api = useApiOnce('get', 'https://www.boredapi.com/api/activity')

  if (api.error) return <div>{api.error}</div>
  if (api.loading) return <div>'Loading...'</div>
  return <div>{api.data.activity}</div>
}
```

```js
import { useState } from 'react'
import { useApi } from './api.js'

const Component = () => {
  const [msg, setMsg] = useState()
  const api = useApi()

  const handleClick = async () => {
    const data = await api.get('https://www.boredapi.com/api/activity')
    if (!data) return
    setMsg(data.activity)
  }

  if (api.error) return <div>{api.error}</div>
  if (api.loading) return <div>'Loading...'</div>
  return (
    <button onClick={handleClick}>{msg ?? 'Click me to get message'}</button>
  )
}
```

<br/>

---

<br/>

## Advanced usages of `ReactApi`:

```js
ReactApi(AxiosInstanceConfig, ReactApiConfig)
// { instance, methods, useApi, useApiOnce, useSuspenseApiOnce }
```

Check [Axios instance config](https://axios-http.com/docs/instance) for `AxiosInstanceConfig`

<br />

## `ReactApiConfig` options:

```ts
{
  _getSuccess?: (response: AxiosResponse) => any
  getSuccess?: (response: AxiosResponse) => any
  _getFail?: (err: AxiosError) => void
  getFail?: (err: AxiosError) => void
}
```

### Option `_getSuccess` & `_getFail`:

These are middleware. When a request succeed this function is called, After finishing this function `getSuccess` | `getFail` starts. This function can be an `async` function.

### Option `getSuccess` && getFail:

This gives `AxiosResponse` or `AxiosError` as first argument and send the returned value. This function can be an `async` function.

### Example:

```js
ReactApi(
  {},
  {
    _getSuccess: (response) => {
      console.log('Raw response', response)
    },
    getSuccess: (response) => {
      return response.status === 204
        ? true
        : response.data?.data ?? response.data
    },

    _getFail: (err) => {
      console.log('Raw error', err)
    },
    getFail: (err) => {
      return err.response?.data?.message ?? err.message
    },
  }
)
```

<br />

---

<br/>

## `ReactApi()` API:

This returns:

```ts
{
  instance, methods, useApi, useApiOnce, useSuspenseApiOnce
}
```

### `ReactApi().instance`:

This is just the raw Axios instance

### `ReactApi().methods`:

This is an object:

```ts
{
  request: async Function,
  get: async Function,
  delete: async Function,
  head: async Function,
  options: async Function,
  post: async Function,
  put: async Function,
  patch: async Function,
}
```

All the functions takes axios params,
check [Axios instance config](https://axios-http.com/docs/instance) for more details. And they return `[error, data, isOk]`

### `ReactApi().useApi()`:

#### **Usages:**

```js
import { useState } from 'react'
import { useApi } from './api.js'

const Component = () => {
  const [msg, setMsg] = useState()

  // For normal usages
  const api = useApi()

  // When you don't want to use manually loading component, Just the React.Suspense
  const api = useApi({ suspense: true })

  const handleClick = async () => {
    const data = await api.get('https://www.boredapi.com/api/activity')
    if (!data) return
    setMsg(data.activity)
  }

  if (api.error) return <div>{api.error}</div>
  if (api.loading) return <div>'Loading...'</div>
  return (
    <button onClick={handleClick}>{msg ?? 'Click me to get message'}</button>
  )
}
```

The returned value looks like:

```js
{
  loading: Boolean,
  data: Boolean,
  error: Boolean,

  request: async Function,
  get: async Function,
  delete: async Function,
  head: async Function,
  options: async Function,
  post: async Function,
  put: async Function,
  patch: async Function,

  status: {
    loading: Boolean,
    data: Boolean,
    error: Boolean,
  },

  setStatus: {
    loading: Function, // Set custom loading status
    data: Function, // Set custom data status
    error: Function, // Set custom error status
    reset: Function // Reset status
  },

  methods: {
    request: async Function,
    get: async Function,
    delete: async Function,
    head: async Function,
    options: async Function,
    post: async Function,
    put: async Function,
    patch: async Function,
  }
}
```

These axios methods the returned value from `getSuccess` when there is no error else returns `undefined`

<br />

### `ReactApi().useApiOnce()`:

```js
import { useApiOnce } from './api.js'

const Component = () => {
  // Basic usages
  const api = useApiOnce('get', 'https://www.boredapi.com/api/activity')

  // With a function
  const api = useApiOnce(
    'get',
    'https://www.boredapi.com/api/activity',
    (onDataLoad) => {
      console.log(onDataLoad)
    }
  )

  if (api.error) return <div>{api.error}</div>
  if (api.loading) return <div>'Loading...'</div>
  return <div>{api.data.activity}</div>
}
```

The returned value looks like:

```js
{
  loading: Boolean,
  data: Boolean,
  error: Boolean,

  retry: Function, // Retry the request

  status: {
    loading: Boolean,
    data: Boolean,
    error: Boolean,
  },

  setStatus: {
    loading: Function, // Set custom loading status
    data: Function, // Set custom data status
    error: Function, // Set custom error status
    reset: Function // Reset status
  }
}
```

<br />

### `ReactApi().useSuspenseApiOnce()`:

This uses nearest React.Suspense by default.

```js
import { createAnchor } from 'use-react-api'
import { useApiOnce } from './api.js'
const anchor = createAnchor()

const Component = () => {
  // Basic usages
  const api = useSuspenseApiOnce(
    anchor,
    ['get', 'https://www.boredapi.com/api/activity'],
    ['get', 'https://dummyjson.com/products']
  )

  // With a function
  const api = useSuspenseApiOnce(
    anchor,
    ['get', 'https://www.boredapi.com/api/activity'],
    ['get', 'https://dummyjson.com/products'],
    ([bored, dummy]) => {
      console.log(bored, dummy)
    }
  )

  return <div>{api.data[0].activity}</div>
}
```

The returned value looks like:

```js
;[
  {
    data: any,
    error: any,
    ok: boolean,
  },
]
```

---

<br/>

## Exports

```js
export default ReactApi
export { createAnchor }

// Types
export {
  ReactApiConfig,
  StatusProps,
  StatusMethods,
  AvailableMethods,
  AvailableMethodsString,
}
```

<br/>

---

Made by [Nazmus Sayad](https://github.com/NazmusSayad) with ❤️.
