import { inject, InjectionKey, onMounted, provide, watch } from 'vue'

export const enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}

export const setPreferThemeMode = (mode: ThemeMode) => {
  localStorage.setItem('theme', mode)
  return mode
}

export const getPreferThemeMode = () => {
  const storeMode = localStorage.getItem('theme')

  if (storeMode === ThemeMode.Auto) {
    return getSystemThemeMode()
  }

  if (storeMode === ThemeMode.Dark) {
    return ThemeMode.Dark
  }

  return ThemeMode.Light
}

export const getSystemThemeMode = () => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return ThemeMode.Dark
  }

  return ThemeMode.Light
}

const KEY = Symbol() as InjectionKey<{
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}>

export const privideThemeMode = () => {
  let themeMode = $ref<ThemeMode>(getPreferThemeMode())
  const setThemeMode = (mode: ThemeMode) =>
    (themeMode = setPreferThemeMode(mode))
  const toggleThemeMode = () => {
    switch (themeMode) {
      case ThemeMode.Auto:
        setThemeMode(ThemeMode.Light)
        break
      case ThemeMode.Light:
        setThemeMode(ThemeMode.Dark)
        break
      case ThemeMode.Dark:
        setThemeMode(ThemeMode.Auto)
    }
  }
  const updateRootClass = () => {
    if (getPreferThemeMode() === ThemeMode.Dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  watch(themeMode, updateRootClass, { immediate: true })
  provide(KEY, { themeMode, toggleThemeMode, setThemeMode })
  onMounted(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', updateRootClass)
    } else if (typeof media.addListener === 'function') {
      media.addListener(updateRootClass)
    }
  })
}

export default () => {
  const themeMode = inject(KEY)
  return themeMode
}
