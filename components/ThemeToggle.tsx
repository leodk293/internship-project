'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'

const themeKey = 'theme'

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const stored = window.localStorage.getItem(themeKey)
  if (stored === 'dark' || stored === 'light') {
    return stored
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getInitialTheme())

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem(themeKey, theme)
  }, [theme])

  useEffect(() => {
    const handler = (event: MediaQueryListEvent) => {
      if (!window.localStorage.getItem(themeKey)) {
        setTheme(event.matches ? 'dark' : 'light')
      }
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="text-sm cursor-pointer rounded-md py-4 font-medium border bg-white border-gray-300 dark:text-white dark:bg-black dark:border-gray-900"
    >
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </Button>
  )
}
