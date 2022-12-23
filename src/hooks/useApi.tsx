import { useState } from "react"
import { useSchool } from "./api/schools/useSchool"
import { useProm } from './api/schools/useProm'
import { useEmployeePosition } from "./api/schools/useEmployeePosition"
import { useEmployee } from "./api/schools/useEmployee"
import { useTitle } from "./api/schools/useTitle"
import { useGroup } from "./api/schools/useGroup"
import { usePosition } from "./api/schools/usePosition"

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

  return {
    netOnline,
    goOffline,
    goOnline,
    useSchool: useSchool({offline: offlineMode}),
    useProm: useProm({offline: offlineMode}),
    useEmployee: useEmployee({offline: offlineMode}),
    useTitle: useTitle({offline: offlineMode}),
    useGroup: useGroup({offline: offlineMode}),
    useEmployeePosition: useEmployeePosition({offline: offlineMode}),
    usePosition: usePosition({offline: offlineMode})
  }
}
