import { ThemeMode } from "./hooks/useThemeMode"

export const SITE_NAME = import.meta.env.VITE_SITE_NAME
export const SITE_DESCRIPTION = import.meta.env.VITE_SITE_DESCRIPTION
export const SITE_DOMAIN = import.meta.env.VITE_SITE_DOMAIN
export const AUTHOR_NAME = import.meta.env.VITE_AUTHOR_NAME
export const AUTHOR_EMAIL = import.meta.env.VITE_AUTHOR_EMAIL
export const DOCSEARCH_ID = import.meta.env.VITE_DOCSEARCH_ID
export const DOCSEARCH_KEY = import.meta.env.VITE_DOCSEARCH_KEY
export const DOCSEARCH_INDEXNAME = import.meta.env.VITE_DOCSEARCH_INDEXNAME

export const DEFAULT_THEME_MODE = import.meta.env.VITE_DEFAULT_THEME_MODE as ThemeMode
export const SSR = import.meta.env.SSR

export const DEV = import.meta.env.DEV
