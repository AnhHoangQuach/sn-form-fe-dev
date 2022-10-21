import demoPDF from './demo.pdf'
import React, { useCallback, useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import { useIntersectionObserver } from 'hooks'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const observerConfig = {
  threshold: 0,
}

const PageWithObserver = ({ pageNumber, setPageVisibility, setTimers, ...otherProps }) => {
  const [page, setPage] = useState()

  const onIntersectionChange = useCallback(
    ([entry]) => {
      setTimers((timers) => {
        const timer = timers[pageNumber] || { total: 0, start: null, count: 0 }

        if (entry.isIntersecting) {
          timer.count++
          timer.start = new Date()
        } else if (timer.start) {
          timer.total += new Date().getTime() - timer.start.getTime()
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

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  const setPageVisibility = useCallback((pageNumber, isIntersecting, timer) => {
    setVisiblePages((prevVisiblePages) => ({
      ...prevVisiblePages,
      [pageNumber]: { isIntersecting, timer },
    }))
  }, [])

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
