import { useEffect } from 'react'

export default function useIntersectionObserver(element, options, observerCallback) {
  useEffect(() => {
    if (!element || !('IntersectionObserver' in window)) {
      return undefined
    }

    const observer = new IntersectionObserver(observerCallback, options)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [element, options, observerCallback])
}
