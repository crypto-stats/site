import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const SaveMessagePopup = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px;
  background: rgb(239 37 37 / 70%);
  border-radius: 4px;
  top: 24px;
  color: white;
`

const SaveMessage: React.FC = () => {
  const [showSaveMessage, setShowSaveMessage] = useState(false)

  useEffect(() => {
    const saveBlocker = (e: any) => {
      if ((e.metaKey || e.ctrlKey) && e.keyCode == 83) {
        e.preventDefault()
        setShowSaveMessage(true)
        setTimeout(() => setShowSaveMessage(false), 5000)
      }
    }

    window.document.addEventListener('keydown', saveBlocker, false)

    return () => window.document.removeEventListener('keydown', saveBlocker)
  }, [])

  return (
    <>
      {showSaveMessage && <SaveMessagePopup>Your changes are saved automatically</SaveMessagePopup>}
    </>
  )
}

export default SaveMessage
