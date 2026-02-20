import { useResearchStore } from '../store/researchStore'
import { ExternalLink } from 'lucide-react'

const confidenceColor = (c) =>
  c >= 0.75 ? 'text-green-400 bg-green-400/10 border-green-400/20'
  : c >= 0.5 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
  : 'text-red-400 bg-red-400/10 border-red-400/20'

const statusIcon = (s) =>
  s === 'Verified' ? '✅' : s === 'Partially Verified' ? '⚠️' : '❓'

export default function ResultsPanel() {
  const { sources, keyPoints, overview, verifiedPoints, overallConfidence, verdict } = useResearchStore()

  return (
    <div className="space-y-4">
      {/* Sources */}
      {sources.length > 0 && (
        <div className="card space-y-3">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            🔍 Sources Found <span className="text-xs text-gray-500">{sources.length}</span>
          </h3>
          <div className="space-y-2">
            {sources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer"
                className="flex items-start gap-3 p-3 bg-gray-800 hover:bg-gray-750 rounded-xl group transition-all">
                <div className="w-5 h-5 bg-blue-400/10 rounded-md flex items-center justify-center mt-0.5 shrink-0">
                  <span className="text-xs text-blue-400 font-bold">{i+1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate group-hover:text-indigo-400 flex items-center gap-1">
                    {s.title} <ExternalLink size={11} className="opacity-0 group-hover:opacity-100" />
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2 mt-0.5">{s.snippet}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Overview */}
      {overview && (
        <div className="card space-y-2">
          <h3 className="font-semibold text-white text-sm">📝 Overview</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{overview}</p>
        </div>
      )}

      {/* Key Points */}
      {keyPoints.length > 0 && (
        <div className="card space-y-3">
          <h3 className="font-semibold text-white text-sm">💡 Key Points</h3>
          <ul className="space-y-2">
            {keyPoints.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-400">
                <span className="text-indigo-400 font-bold shrink-0">{i+1}.</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Verified Points */}
      {verifiedPoints.length > 0 && (
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">🔎 Fact-Check Results</h3>
            {overallConfidence > 0 && (
              <span className={`text-xs px-2 py-1 rounded-full border font-medium ${confidenceColor(overallConfidence)}`}>
                {(overallConfidence * 100).toFixed(0)}% — {verdict?.split(' ')[0]}
              </span>
            )}
          </div>
          <div className="space-y-2">
            {verifiedPoints.map((vp, i) => (
              <div key={i} className="p-3 bg-gray-800 rounded-xl space-y-1">
                <div className="flex items-start gap-2">
                  <span className="text-sm shrink-0">{statusIcon(vp.status)}</span>
                  <p className="text-sm text-gray-300">{vp.point}</p>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${confidenceColor(vp.confidence)}`}>
                    {(vp.confidence * 100).toFixed(0)}%
                  </span>
                  <span className="text-xs text-gray-600">{vp.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
