import demoPDF from './demo.pdf'
import React, { useCallback, useState, useMemo } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import { useIntersectionObserver, usePageVisibility } from 'hooks'
import { toNumericPairs } from 'utils/common'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const observerConfig = {
  threshold: 0,
}

const PageWithObserver = ({ pageNumber, setPageVisibility, setTimers, ...otherProps }) => {
  const [page, setPage] = useState()

  const onIntersectionChange = useCallback(
    ([entry]) => {
      setTimers((timers) => {
        const timer = timers[pageNumber] || { durations: [], start: null, views: 0 }

        if (entry.isIntersecting) {
          timer.start = new Date()
          if (!timer.durations[timer.views]?.start) {
            timer.durations[timer.views] = {
              start:
                new Date().getHours() +
                ':' +
                new Date().getMinutes() +
                ':' +
                new Date().getSeconds(),
              end: null,
            }
          }

          timer.views++
        } else if (timer.start) {
          timer.durations[timer.views - 1] = {
            ...timer.durations[timer.views - 1],
            end:
              new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
          }
          timer.start = null
        }

        return { ...timers, [pageNumber]: timer }
      })

      setPageVisibility(pageNumber, entry.isIntersecting)
    },
    [pageNumber, setPageVisibility, setTimers]
  )

  useIntersectionObserver(page, observerConfig, onIntersectionChange)

  return <Page canvasRef={setPage} pageNumber={pageNumber} {...otherProps} />
}

const App = () => {
  const [numPages, setNumPages] = useState(null)

  const [visiblePages, setVisiblePages] = useState({})
  const [timers, setTimers] = React.useState({})

  const { count, isVisible } = usePageVisibility()

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  const setPageVisibility = useCallback((pageNumber, isIntersecting, timer) => {
    setVisiblePages((prevVisiblePages) => ({
      ...prevVisiblePages,
      [pageNumber]: { isIntersecting, timer },
    }))
  }, [])

  useMemo(() => {
    if (isVisible && count >= 1) {
      const visiblePagesCurrent = toNumericPairs(visiblePages).filter(
        (page) => page[1].isIntersecting
      )

      visiblePagesCurrent.forEach((page, index) => {
        const pageNumber = page[0]
        setTimers((timers) => {
          const timer = timers[pageNumber] || { durations: [], start: null, views: 0 }

          timer.durations[timer.durations.length - 1] = {
            ...timer.durations[timer.durations.length - 1],
            end:
              new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
          }

          timer.durations[timer.durations.length] = {
            start:
              new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
            end: null,
          }

          timer.views++

          return { ...timers, [pageNumber]: timer }
        })
      })
    }
  }, [isVisible, count])

  console.log(timers)

  return (
    <div className="flex items-center justify-center bg-[#262626]">
      <Document file={demoPDF} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <PageWithObserver
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            setPageVisibility={setPageVisibility}
            setTimers={setTimers}
          />
        ))}
      </Document>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          background: 'white',
          padding: 10,
          border: '1px thin',
        }}
      >
        Visible pages:{' '}
        {Object.entries(visiblePages)
          .filter(([key, value]) => value.isIntersecting)
          .map(([key]) => key)
          .join(', ') || '(none)'}
      </div>
    </div>
  )
}

export default App
