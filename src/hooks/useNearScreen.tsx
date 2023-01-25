import { useEffect, useRef, useState } from "react"

export const useNearScreen = () => {
  const [show, setShow] = useState(false)
  const element = useRef(null)

  useEffect(() => {
    if (!element.current) return
    const observer = new window.IntersectionObserver((entries) => {
      const {isIntersecting} = entries[0]
      if (isIntersecting) {
        setShow(true)
        observer.disconnect()
      }
    })
    observer.observe(element.current)
  }, [element])

  return {
    show,
    element,
    setShow
  }
}
