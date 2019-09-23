import { useLayoutEffect, useRef, MutableRefObject } from 'react'

type Maybe<T> = T | null

const domNodes = new Map<HTMLElement, Map<string, EventListenerOrEventListenerObject>>()

function useBindings(bindings: { [key: string]: any }) {
  const ref: MutableRefObject<any> = useRef(null)

  useLayoutEffect(() => {
    const domNode: Maybe<HTMLElement> = ref.current

    if (!domNode) {
      return
    }

    for (let prop in bindings) {
      if (prop === 'children') {
        continue
      }
      if (prop.startsWith('on')) {
        const eventName = prop.replace(/on(\w)/i, (_, char) => char.toLowerCase())

        bindEvent(domNode, eventName, bindings[prop])
      } else {
        // @ts-ignore
        domNode[prop] = bindings[prop]
      }
    }
    /**
     * On destroy, we need to remove the reference to the domNode to avoid memory-leaks
     */
    return () => {
      domNodes.delete(domNode)
    }
  }, [ref, bindings]);

  return ref
}

function bindEvent(domNode: HTMLElement, eventName: string, eventHandler: EventListenerOrEventListenerObject) {
  if (!domNodes.has(domNode)) {
    domNodes.set(domNode, new Map())
  }
  const events = domNodes.get(domNode)

  if (!events) {
    return
  }

  const prevHandler = events.get(eventName)
  if (prevHandler) {
    domNode.removeEventListener(eventName, prevHandler)
  }
  if (typeof eventHandler === 'function') {
    domNode.addEventListener(eventName, eventHandler)
    events.set(eventName, eventHandler)
  } else {
    events.delete(eventName)
  }
}

export default useBindings
