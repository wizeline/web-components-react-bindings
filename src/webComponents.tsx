import * as React from 'react'
import useBindings from './useBindings'

type Bindings = { [key: string]: any }

type WebComponent = Object & { [key: string]: any }

const webComponentNames: { [key: string]: string } = {}

/**
 * Proxy that will return the function to create web-component instances along with bindings
 * @param namespace (Optional) If provided, component names will be prefixed with `{namespace}-`
 */
function createProxy(namespace?: string) {
  return new Proxy<WebComponent>({}, {
    get(_, componentName: string) {
      return (bindings: Bindings) => {
        const Component = getWebComponentName(componentName, namespace)
        const ref = useBindings(bindings)
        const { children } = bindings

        if (children) {
          // @ts-ignore
          return <Component ref={ref}>{children}</Component>  
        }
        // @ts-ignore
        return <Component ref={ref} />
      }
    }
  })
}

function getWebComponentName(camelCasedName: string, namespace?: string): string {
  if (webComponentNames[camelCasedName]) {
    return webComponentNames[camelCasedName]
  }
  const prefix = namespace ? namespace + '-' : ''
  const webComponentName = prefix + camelCasedName.replace(/[A-Z]/g, (char, index) => (
    `${index > 0 ? '-' : ''}${char.toLowerCase()}`
  ))
  webComponentNames[camelCasedName] = webComponentName

  return webComponentName
}

function createNamespace(namespace: string): WebComponent {
  return createProxy(namespace)
}

export default createProxy()
export {
  createNamespace
}
