import { useCallback, useEffect, useState } from 'react'

const THEME_KEY = 'daily-task-manager:theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

export type Theme = 'light' | 'dark' | 'system'

const ORDER: Theme[] = ['light', 'dark', 'system']

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (ORDER.includes(stored as Theme)) return stored as Theme
  } catch {
    // localStorage deshabilitado: se usa la preferencia del sistema.
  }

  return 'system'
}

function applyTheme(theme: Theme): void {
  const dark =
    theme === 'dark' || (theme === 'system' && window.matchMedia(DARK_QUERY).matches)

  document.documentElement.classList.toggle('dark', dark)
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme)

  useEffect(() => {
    applyTheme(theme)

    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // Sin persistencia el tema sigue aplicándose durante la sesión.
    }
  }, [theme])

  // Con 'system' hay que seguir los cambios del sistema operativo en caliente.
  useEffect(() => {
    if (theme !== 'system') return

    const media = window.matchMedia(DARK_QUERY)
    const sync = () => applyTheme('system')

    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [theme])

  const cycleTheme = useCallback(() => {
    setTheme((prev) => ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length])
  }, [])

  return { theme, cycleTheme }
}
