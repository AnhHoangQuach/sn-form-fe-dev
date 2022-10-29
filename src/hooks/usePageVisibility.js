import { useState, useEffect } from 'react'

function getBrowserVisibilityProp() {
  if (typeof document.hidden !== 'undefined') return 'visibilitychange'
  else if (typeof document.msHidden !== 'undefined') return 'msvisibilitychange'
  else if (typeof document.webkitHidden !== 'undefined') return 'webkitvisibilitychange'
}

function getBrowserDocumentHiddenProp() {
  if (typeof document.hidden !== 'undefined') return 'hidden'
  else if (typeof document.msHidden !== 'undefined') return 'msHidden'
  else if (typeof document.webkitHidden !== 'undefined') return 'webkitHidden'
}

function getIsDocumentHidden() {
  return !document[getBrowserDocumentHiddenProp()]
}

function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(getIsDocumentHidden())
  const [count, setCount] = useState(0)
  const onVisibilityChange = () => {
    setCount(1)
    setIsVisible(getIsDocumentHidden())
  }

  useEffect(() => {
    const visibilityChange = getBrowserVisibilityProp()

    document.addEventListener(visibilityChange, onVisibilityChange, false)

    return () => {
      document.removeEventListener(visibilityChange, onVisibilityChange)
    }
  })

  return { isVisible, count }
}

export default usePageVisibility
