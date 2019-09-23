# web-components-react-bindings

## What?

`web-components-react-bindings` allows binding non-string props (like numbers, objects, arrays or functions) to `web-components` using `React`

## Why?

`React` doesn't play well with `web-components` natively, so a bindings layer is necessary to correctly pass-down properties and bind events.

You can check more info about this on this URL: https://custom-elements-everywhere.com/

## How?

`web-components-react-bindings` uses `Proxy` and `react-hooks` under the hood:
- `react-hooks`: to set non-string properties and to bind to events we need to get a reference to the component's instance; for this purpose we are using `useRef` and creating a new hook called `useBindings` that will receive the props and pass down to `web-components` accordingly.
- `Proxy`: whenever you call the proxy it will return a function that is used as a `HOC` to connect your `React` application with native `web-components`, using `useBindings` described above.


## Simple example

Imagine ther is a `custom-button` web-component registered, and it accepts a `label` property and emmits an `buttonClick` event; you will instantiate the component into your `React` app using the following snippet:

```js
import WC from 'web-components-react-bindings'

const App = () => {

  function handleClick() {
    console.log('clicked!')
  }

  return (
    <p>This is my button: </p>
    <WC.CustomButton label={'My button'} onButtonClick={handleClick} />
  )
}

export default App
```

`WC` in the example above is the proxy. When you are accesing one of it's properties like `WC.CustomButton` it is returning a constructor function that will instantiate your `<custom-button>` web-component and implement `useBindings()` with the props you are passing to `<WC.CustomButton />`

Note that for binding events the property name should begin with `on`; for the moment this convention is necessary for this to work properly.


## Using Namespaces

If all your `web-components` share the same prefix/namespace (e.g. `custom-`) then you can create a namespace to intantiate those component easily.

First, create a file to create and export your namespace (e.g. `customWebComponents.js`): 

```js
import { createNamespace } from 'web-components-react-bindings'

export default createNamespace('my-components')
```

Then you can use it in your `React` components:

```js
import WC from './customWebComponents'

const App = () => {

  function handleClick() {
    console.log('clicked!')
  }

  return (
    <p>This is my button: </p>
    <WC.Button label={'My button'} onButtonClick={handleClick} />
  )
}

export default App
```

Note that the example is very similar, but now you can avoid adding `Custom` for each of your components name.


## License

MIT
