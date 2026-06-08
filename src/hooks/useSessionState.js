import { useEffect, useState } from 'react'

// State that survives reloads within the browser session (sessionStorage),
// but is cleared when the tab closes. Falls back gracefully if storage is unavailable.
export function useSessionState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = sessionStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* storage unavailable / quota — ignore */
    }
  }, [key, state])

  return [state, setState]
}
