export type AppTheme = 'light' | 'dark'

export const APP_THEME_CHANGE_EVENT = 'app-theme-change'

export function getAppTheme(): AppTheme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function setAppTheme(theme: AppTheme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem('theme', theme)
  window.dispatchEvent(
    new CustomEvent<AppTheme>(APP_THEME_CHANGE_EVENT, { detail: theme }),
  )
}
