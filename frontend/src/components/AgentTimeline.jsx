import { useResearchStore } from '../store/researchStore'
import { Search, Brain, CheckCircle, FileText, Loader2 } from 'lucide-react'

const AGENTS = [
  { name: 'ResearchAgent', label: 'Research', icon: Search, color: 'text-blue-400', ring: 'ring-blue-400' },
  { name: 'SummarizerAgent', label: 'Summarizer', icon: Brain, color: 'text-purple-400', ring: 'ring-purple-400' },
  { name: 'FactCheckAgent', label: 'Fact-Check', icon: CheckCircle, color: 'text-green-400', ring: 'ring-green-400' },
  { name: 'ReportAgent', label: 'Report', icon: FileText, color: 'text-orange-400', ring: 'ring-orange-400' },
]

export default function AgentTimeline() {
  const { logs, status } = useResearchStore()

  const activeAgents = new Set(logs.map(l => l.agent))
  const lastAgent = logs[logs.length - 1]?.agent

  return (
    <div className="card space-y-4">
      <h3 className="font-semibold text-white text-sm">Agent Pipeline</h3>

      <div className="space-y-3">
        {AGENTS.map(({ name, label, icon: Icon, color, ring }) => {
          const isDone = activeAgents.has(name) && lastAgent !== name
          const isActive = lastAgent === name && status === 'running'
          const isPending = !activeAgents.has(name)

          return (
            <div key={name} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              isActive ? 'bg-gray-800 ring-1 ' + ring : isDone ? 'bg-gray-800/50' : 'opacity-40'
            }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-900 ${isPending ? '' : color}`}>
                {isActive ? <Loader2 size={16} className={`${color} animate-spin`} /> : <Icon size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${isPending ? 'text-gray-600' : 'text-white'}`}>{label}</div>
                {isDone && <div className="text-xs text-gray-500">Complete ✓</div>}
                {isActive && <div className="text-xs text-gray-400 animate-pulse">Running...</div>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Logs */}
      <div className="space-y-1 max-h-48 overflow-y-auto">
        <div className="text-xs text-gray-600 font-mono mb-2">Live logs</div>
        {logs.map((log, i) => (
          <div key={i} className="text-xs font-mono text-gray-400 flex gap-2">
            <span className="text-gray-600 shrink-0">{log.timestamp}</span>
            <span className="truncate">{log.message}</span>
          </div>
        ))}
        {logs.length === 0 && <div className="text-xs text-gray-600 font-mono">Waiting for agents...</div>}
      </div>
    </div>
  )
}
