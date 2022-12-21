import { useState } from "react"
import { useSchools } from "./api/schools/useSchools"
import { useProms } from './api/schools/useProms'

export const useApi = () => {
  const [offlineMode, setOfflineMode] = useState(Boolean(localStorage.getItem('offline')))
  const [netOnline, setNetOnline] = useState(navigator.onLine)

  const goOffline = () => {
    localStorage.setItem('offline', String(true))
    setOfflineMode(Boolean(localStorage.getItem('offline')))
  }

  const goOnline = () => {
    localStorage.setItem('offline', String(false))
    setOfflineMode(Boolean(localStorage.getItem('offline')))
  }

  window.addEventListener('offline', (_) => {
    setNetOnline(false)
  })

  window.addEventListener('online', (_) => {
    setNetOnline(true)
  })

  const useSchool = useSchools({offline: offlineMode})
  const useProm = useProms({offline: offlineMode})

  return {
    netOnline,
    goOffline,
    goOnline,
    useSchool,
    useProm
  }
}
