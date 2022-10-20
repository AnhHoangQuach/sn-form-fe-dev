import demoPDF from './demo.pdf'
import { PdfViewer } from 'components'

const App = () => {
  return (
    <div className="flex items-center justify-center bg-[#262626]">
      <PdfViewer pdf={demoPDF} />
    </div>
  )
}

export default App
