import { useRef } from 'react'

export const runOnce = (fn: () => void) => {
  const ran = useRef(false)

  if (!ran.current) {
    fn()
    ran.current = true
  }
}
