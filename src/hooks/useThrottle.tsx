import { useRef } from 'react'

export const useThrottle = () => {
  const timeout = useRef<number | undefined>(undefined)

  const throttle = (cb: Function, time?: number) => {
    if (timeout.current) return
    timeout.current = window.setTimeout(() => {
      cb()
      window.clearTimeout(timeout.current)
    }, time ?? 500)
  }

  async function promiseHelper<T> (cb?: Promise<T>, time?: number) {
    if (cb == null) return
    return await new Promise<T>((resolve, reject) => throttle(() => {
      cb.then(
        (r) => resolve(r)
      ).catch(
        (e) => reject(e)
      )
    }, time))
  }

  return {
    throttle,
    promiseHelper
  }
}
