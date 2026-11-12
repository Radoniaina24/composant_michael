import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  APP_THEME_CHANGE_EVENT,
  setAppTheme,
  type AppTheme,
} from '@/lib/theme'

const STORAGE_KEY = 'theme'

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') {
    return stored === 'dark'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ModeToggle() {
  const [isDark, setIsDark] = useState(getInitialTheme)

  useEffect(() => {
    setAppTheme(isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    function syncTheme(event: Event) {
      const themeEvent = event as CustomEvent<AppTheme>
      setIsDark(themeEvent.detail === 'dark')
    }

    window.addEventListener(APP_THEME_CHANGE_EVENT, syncTheme)
    return () => window.removeEventListener(APP_THEME_CHANGE_EVENT, syncTheme)
  }, [])

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={
              isDark ? 'Activer le thème clair' : 'Activer le thème sombre'
            }
            onClick={() => setIsDark((value) => !value)}
          />
        }
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </TooltipTrigger>
      <TooltipContent>
        {isDark ? 'Thème clair' : 'Thème sombre'}
      </TooltipContent>
    </Tooltip>
  )
}
