# react-net-kit

Simplify HTTP and WebSocket requests in React with this versatile package.

[![npm package](https://img.shields.io/npm/v/react-net-kit)](https://npmjs.com/package/react-net-kit)

---

## Features

- Seamless `React.Suspense` integration.
- Lightweight and efficient.
- Supports both automatic and manual requests.
- Fully customizable to fit your needs.
- Powered by Axios for reliable HTTP requests.
- Manage multiple instances effortlessly.

---

## Installation

Choose your preferred package manager to get started:

### npm

shellCopy code

`npm i react-net-kit axios`

### yarn

shellCopy code

`yarn add react-net-kit axios`

### pnpm

shellCopy code

`pnpm add react-net-kit axios`

---

# Setup

Configure your application with the desired settings.

## Basic Usage:

**api.js**

```js
import ReactNetKit from 'react-net-kit'
export const { useApi, useApiOnce, createSuspense } = ReactNetKit()
```

**Component.js**

```tsx
import { useApiOnce } from './api.js'

const Component = () => {
  const api = useApiOnce({ get: 'https://www.boredapi.com/api/activity' })
  const [bored] = api.responses

  if (api.loading) return <div>'Loading...'</div>
  if (bored.error) return <div>{bored.error}</div>
  return <div>{bored.data.activity}</div>
}
```

```tsx
import { useApi } from './api.js'

const Component = () => {
  const api = useApi()

  const handleClick = async () => {
    const { data, ok } = await api.get('https://www.boredapi.com/api/activity')
    console.log(data)
  }

  if (api.loading) return <div>'Loading...'</div>
  if (api.response.error) return <div>{api.response.error}</div>
  return (
    <button onClick={handleClick}>
      {api.response.data ?? 'Click me to get a message'}
    </button>
  )
}
```

```tsx
import { useState } from 'react'
import { createSuspense } from './api.js'

const useSuspense = createSuspense()
const Component = () => {
  const api = useApi()

  const handleClick = async () => {
    const { data, ok } = await api.get('https://www.boredapi.com/api/activity')
    console.log(data)
  }

  if (api.loading) return <div>'Loading...'</div>
  if (api.response.error) return <div>{api.response.error}</div>
  return (
    <button onClick={handleClick}>
      {api.response.data ?? 'Click me to get a message'}
    </button>
  )
}
```

---

<br/>

## Advanced Usages of `ReactNetKit`:

```js
ReactNetKit(AxiosInstanceConfig && ReactNetKitConfig)
```

Check the [Axios instance config](https://axios-http.com/docs/instance) for `AxiosInstanceConfig`.

---

## `ReactNetKitConfig` Options:

```tsx
{
  formatData?: (response: AxiosResponse) => formattedData,
  formatError?: (err: AxiosError) => formattedError,
}
```

### Options `formatData` and `formatError`:

These options accept `AxiosResponse` or `AxiosError` as the first argument and return the desired formatted data or error.

#### Example:

```js
ReactNetKit({
  formatData: (response) => {
    return response.status === 204 ? true : response.data?.data ?? response.data
  },

  formatError: (err) => {
    return err.response?.data?.message ?? err.message
  },
})
```

---

### `ReactNetKit().axios`:

Access the raw Axios instance.

### `ReactNetKit().methods`:

This object provides various HTTP request methods, all of which return `{error, data, ok}`:

```tsx
{
  requests: async Function,
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

All functions accept Axios parameters; refer to the [Axios instance config](https://axios-http.com/docs/instance) for details.

### `ReactNetKit().useApi(config)`:

#### Usage Examples:

```js
import { useApi } from './api.js'

const Component = () => {
  const api = useApi()

  const handleClick = async () => {
    const { data, ok } = await api.get('https://www.boredapi.com/api/activity')
    console.log(data)
  }

  if (api.loading) return <div>'Loading...'</div>
  if (api.response.error) return <div>{api.response.error}</div>
  return (
    <button onClick={handleClick}>
      {api.response.data ?? 'Click me to get a message'}
    </button>
  )
}
```

---

### `ReactNetKit().useApiOnce(...axios, onLoad)`:

```js
import { useApi } from './api.js'

const Component = () => {
  const api = useApi()

  const handleClick = async () => {
    const { data, ok } = await api.get('https://www.boredapi.com/api/activity')
    console.log(data)
  }

  if (api.loading) return <div>'Loading...'</div>
  if (api.response.error) return <div>{api.response.error}</div>
  return (
    <button onClick={handleClick}>
      {api.response.data ?? 'Click me to get a message'}
    </button>
  )
}
```

---

### `ReactNetKit().createSuspense()`:

This function returns a hook that utilizes `React.Suspense`. Please create a new hook for each component to avoid conflicts.

```js
import { createSuspense } from './api.js'
const useSuspenseApi = createSuspense()
const useSuspenseApi2 = createSuspense({ cache: true })

const Component = () => {
  // Basic usage
  const [bored, dummy] = useSuspenseApi(
    { url: 'https://www.boredapi.com/api/activity' },
    { url: 'https://dummyjson.com/products' }
  )

  // With a callback function
  const api2 = useSuspenseApi2(
    { url: 'https://www.boredapi.com/api/activity' },
    { url: 'https://dummyjson.com/products' },
    ([bored, dummy]) => {
      // This onLoad function is called once when the data loads for the first time
      console.log(bored.data, dummy.data)
    }
  )

  return <div>{bored.data.activity}</div>
}
```

---

## What about **AbortController**?

While adding `AbortController`, consider the potential performance impact.

```js
import { useSignal } from 'react-net-kit'
import { useApi } from './api.js'

const Component = () => {
  const api = useApi()
  const [signal, abort, isActive] = useAbortSignal()

  const handleSearch = async (e) => {
    const res = await api.get('/user/search', {
      signal: signal(),
    })
  }
}
```

---

<br/> <br/>

# Wait a minute, what about **WebSocket**?

**ws.js**

```js
import ReactWs from 'react-net-kit/ws'
import { io } from 'socket.io-client'

const socket = io('http://localhost:8000')

socket.on('connect', () => {
  console.log('connected')
})

export const { useWs, useDataWs } = ReactWs(socket, {
  checkData(res) {
    return res.status === 'success'
  },
  formatData(res) {
    return res.data ?? res
  },
  formatError(res) {
    return res.message ?? res
  },
})
```

**App.js**

```js
import { useWs } from './ws'

const App = () => {
  const ws = useWs({ suspense: true })

  const handleClick = async () => {
    // This works similar to useApi().request but for WebSocket!
    const [res] = await ws.send('hello')
    console.log(res)
  }

  const handleClick = async () => {
    // This works similar to useApi().requests
    const [res1, res2] = await ws.send('hello')
    console.log(res1, res2)
  }

  return <button onClick={handleClick}>Click</button>
}
```

---

Made with ❤️ by [Nazmus Sayad](https://github.com/NazmusSayad).
