import { inject, InjectionKey, onMounted, provide, ref, Ref, watch, readonly } from 'vue'
import { DEFAULT_THEME_MODE } from '~/env'
import { defaultWindow } from '@vueuse/core'

export const enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}

export const setPreferThemeMode = (mode: ThemeMode) => {
  defaultWindow?.localStorage.setItem('theme', mode)
  return mode
}

export const getPreferThemeMode = () => {
  const storeMode = defaultWindow?.localStorage.getItem('theme')

  if ([ThemeMode.Auto, ThemeMode.Dark, ThemeMode.Light].includes(storeMode as ThemeMode)) {
    return storeMode as ThemeMode
  }

  return DEFAULT_THEME_MODE
}

export const getSystemThemeMode = (): ThemeMode.Dark | ThemeMode.Light => {
  if (defaultWindow?.matchMedia('(prefers-color-scheme: dark)').matches) {
    return ThemeMode.Dark
  }

  return ThemeMode.Light
}

const KEY = Symbol() as InjectionKey<{
  themeMode: Readonly<Ref<ThemeMode>>;
  toggleThemeMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}>

export const provideThemeMode = () => {
  const themeMode = ref<ThemeMode>(getPreferThemeMode())
  const setThemeMode = (mode: ThemeMode) =>
    (themeMode.value = setPreferThemeMode(mode))
  const toggleThemeMode = () => {
    switch (themeMode.value) {
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
    if ((themeMode.value === ThemeMode.Auto && getSystemThemeMode() === ThemeMode.Dark) || themeMode.value === ThemeMode.Dark) {
      defaultWindow?.document.documentElement.classList.add('dark')
    } else {
      defaultWindow?.document.documentElement.classList.remove('dark')
    }
  }
  watch(themeMode, updateRootClass, { immediate: true })
  provide(KEY, { themeMode: readonly(themeMode), toggleThemeMode, setThemeMode })
  onMounted(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', updateRootClass)
    } else if (typeof media.addListener === 'function') {
      media.addListener(updateRootClass)
    }
  })
}

export default () => inject(KEY)
