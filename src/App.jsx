import { useState } from 'react'
import Landing from './Landing'
import Survey from './Survey'
import Complete from './Complete'

export default function App() {
  const [view, setView] = useState('landing')
  const [submissionId, setSubmissionId] = useState(null)

  const handleStart = () => {
    setView('survey')
    window.scrollTo(0, 0)
  }

  const handleComplete = (id) => {
    setSubmissionId(id)
    setView('complete')
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setView('landing')
    window.scrollTo(0, 0)
  }

  return (
    <div className="app">
      {view === 'landing' && <Landing onStart={handleStart} />}
      {view === 'survey' && <Survey onComplete={handleComplete} onBack={handleBack} />}
      {view === 'complete' && <Complete submissionId={submissionId} onHome={handleBack} />}
    </div>
  )
}
