import { useEffect, useState } from 'react'

const storageKey = 'images'

export const useImages = () => {
  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    const existingStorage = JSON.parse(window.localStorage.getItem(storageKey) || '[]')
    setList(existingStorage)
  }, [])

  const addImage = (cid: string, type: string, name: string) => {
    const newList = JSON.parse(window.localStorage.getItem(storageKey) || '[]')
    newList.push({ cid, type, name })
    window.localStorage.setItem(storageKey, JSON.stringify(newList))

    setList(newList)
  }

  const response: [any[], typeof addImage] = [list, addImage]
  return response
}
