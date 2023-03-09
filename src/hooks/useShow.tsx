import { useState } from 'react'

export const useShow = (init: boolean) => {
  const [show, setShow] = useState(init)
  return {
    show,
    setShow
  }
}
