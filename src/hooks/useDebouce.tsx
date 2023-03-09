import { useRef } from 'react'

export const useDebounce = () => {
  const timeout = useRef<number | undefined>()

  const debounce = (cb: Function, time?: number) => {
    window.clearTimeout(timeout.current)
    timeout.current = window.setTimeout(() => {
      cb()
    }, time ?? 500)
  }

  async function promiseHelper<T> (cb: Promise<T>, time?: number) {
    return await new Promise<T>((resolve, reject) => debounce(() => {
      cb.then(
        (r) => resolve(r)
      ).catch(
        (e) => reject(e)
      )
    }, time))
  }

  return {
    debounce,
    promiseHelper
  }
}
