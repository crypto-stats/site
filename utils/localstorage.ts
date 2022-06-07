const PREFIX = 'cryptostats'

export const setLocalStorage = (key: string, data: any) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(`${PREFIX}:${key}`, JSON.stringify(data))
}

export const getLocalStorage = (key: string) => {
  if (typeof window === 'undefined') return null
  const LS = window.localStorage.getItem(`${PREFIX}:${key}`) || ''
  return LS ? JSON.parse(LS) : null
}
