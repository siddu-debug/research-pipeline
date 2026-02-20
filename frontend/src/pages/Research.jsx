import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Loader2, Download, ExternalLink, ChevronRight } from 'lucide-react'
import { useResearchStore } from '../store/researchStore'
import AgentTimeline from '../components/AgentTimeline'
import ProgressBar from '../components/ProgressBar'
import ResultsPanel from '../components/ResultsPanel'
import toast from 'react-hot-toast'

export default function Research() {
  const [input, setInput] = useState('')
  const navigate = useNavigate()
  const { status, progress, startResearch, reset, pdfUrl, report } = useResearchStore()

  const isRunning = status === 'running' || status === 'connecting'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return toast.error('Please enter a topic')
    startResearch(input.trim())
  }

  const suggestions = [
    'Artificial Intelligence in Healthcare',
    'Quantum Computing 2024',
    'Climate Change Solutions',
    'Electric Vehicles Market',
    'Web3 and Blockchain',
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">New Research</h1>
        <p className="text-gray-400 mt-1">Enter a topic and watch 4 AI agents work in real-time</p>
      </div>

      {/* Search Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter research topic e.g. 'AI in Healthcare 2024'"
              disabled={isRunning}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-11 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 text-base"
            />
          </div>

          {/* Suggestions */}
          {status === 'idle' && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 py-1">Try:</span>
              {suggestions.map(s => (
                <button key={s} type="button" onClick={() => setInput(s)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-all">
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={isRunning || !input.trim()} className="btn-primary flex items-center gap-2">
              {isRunning ? <><Loader2 size={16} className="animate-spin" /> Running...</> : <><Search size={16} /> Run Pipeline</>}
            </button>
            {status !== 'idle' && (
              <button type="button" onClick={() => { reset(); setInput('') }}
                className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-all text-sm">
                Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Progress */}
      {status !== 'idle' && (
        <div className="space-y-6">
          <ProgressBar progress={progress} status={status} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <AgentTimeline />
            </div>
            <div className="lg:col-span-2">
              <ResultsPanel />
            </div>
          </div>
        </div>
      )}

      {/* Done — PDF Download */}
      {status === 'done' && pdfUrl && (
        <div className="card border-green-500/30 bg-green-500/5 flex items-center justify-between">
          <div>
            <div className="font-semibold text-white">✅ Report Ready!</div>
            <div className="text-sm text-gray-400">Your PDF report has been generated</div>
          </div>
          <div className="flex gap-3">
            <a href={pdfUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm text-white transition-all">
              <ExternalLink size={15} /> Preview
            </a>
            <a href={`/api/reports/${report?.id}/download`}
              className="flex items-center gap-2 btn-primary text-sm">
              <Download size={15} /> Download PDF
            </a>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="card border-red-500/30 bg-red-500/5 text-red-400 text-sm">
          ❌ Error: {useResearchStore.getState().error}
        </div>
      )}
    </div>
  )
}
