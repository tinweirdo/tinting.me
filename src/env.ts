import { ThemeMode } from "./hooks/useThemeMode"

export const SITE_NAME = import.meta.env.VITE_SITE_NAME
export const DESCRIPTION = import.meta.env.VITE_DESCRIPTION
export const DEFAULT_THEME_MODE = import.meta.env.VITE_DEFAULT_THEME_MODE as ThemeMode
export const AUTHOR = import.meta.env.VITE_AUTHOR
export const EMAIL = import.meta.env.VITE_EMAIL
export const DOMAIN = import.meta.env.VITE_DOMAIN
export const SSR = import.meta.env.SSR
