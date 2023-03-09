import { useEffect, useState } from 'react'

export const useAuth = () => {
  const [user, setUser] = useState({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZGM3NDI1Zi0zMjJmLTQxNDctYjJlNy0xZjc2NGY4ZGNlNmQiLCJyb2xlIjoicm9vdCIsImlhdCI6MTY3MDM1NTgwOH0.WlObmhTggrXOl7wMHMhCZFuQgQBy2zh1jTV5zXWwKyY' })
  // const [requests] = useState<Array<AbortSignal>>([])

  useEffect(() => {
    const { fetch: originalFetch } = window

    window.fetch = async (...args) => {
      let [resource, config] = args
      config = {
        ...config,
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: 'application/json',
          ...config?.headers
        }
      }

      const response = await originalFetch(resource, config)
      return response
    }
  }, [user.token])

  return {
    user, setUser
  }
}
