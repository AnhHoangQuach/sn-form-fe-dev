import { useState, useRef, useEffect } from 'react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'

const PdfViewer = ({ pdf }) => {
  const [numPages, setNumPages] = useState(null)
  const pageRefs = useRef({})

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  useEffect(() => {
    window.addEventListener('scroll', () => {
      const page = Object.entries(pageRefs.current).find(
        ([, ref]) =>
          window.scrollY < ref.getBoundingClientRect().bottom &&
          ref.getBoundingClientRect().bottom > 0
      )
      console.log(
        window.scrollY,
        pageRefs.current[1].getBoundingClientRect().bottom,
        pageRefs.current[2].getBoundingClientRect().bottom
      )
    })
  }, [numPages])

  return (
    <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
      {Array(...Array(numPages))
        .map((x, i) => i + 1)
        .map((page) => (
          <div key={page} ref={(el) => (pageRefs.current[page] = el)}>
            <Page key={`page_${page}`} pageNumber={page} />
            <div className="my-2"></div>
          </div>
        ))}
    </Document>
  )
}

export default PdfViewer
