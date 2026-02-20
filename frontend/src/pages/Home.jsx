import { useNavigate } from 'react-router-dom'
import { Brain, Search, FileText, CheckCircle, Zap, ArrowRight } from 'lucide-react'

const agents = [
  { icon: Search, label: 'Research Agent', desc: 'Searches and collects data from the web in real-time', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  { icon: Brain, label: 'Summarizer Agent', desc: 'Compresses raw data into structured key insights', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
  { icon: CheckCircle, label: 'Fact-Check Agent', desc: 'Validates each claim with confidence scoring', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
  { icon: FileText, label: 'Report Agent', desc: 'Generates a professional downloadable PDF', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
]

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="space-y-16">
      {/* Hero */}
      <div className="text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-full text-sm font-medium">
          <Zap size={14} /> Powered by 4 Specialized AI Agents
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="text-white">Research </span>
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Automated
          </span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          Enter any topic. Our multi-agent pipeline searches, summarizes, fact-checks,
          and delivers a professional PDF report — automatically.
        </p>
        <button onClick={() => navigate('/research')} className="btn-primary inline-flex items-center gap-2 text-base">
          Start Research <ArrowRight size={18} />
        </button>
      </div>

      {/* Agent Pipeline */}
      <div>
        <h2 className="text-2xl font-bold text-center text-white mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {agents.map(({ icon: Icon, label, desc, color, bg }, i) => (
            <div key={label} className="relative">
              {i < 3 && (
                <div className="hidden md:block absolute top-8 -right-2 z-10 text-gray-600">
                  <ArrowRight size={20} />
                </div>
              )}
              <div className={`card border ${bg} space-y-3 h-full`}>
                <div className={`w-10 h-10 rounded-xl ${bg} border flex items-center justify-center`}>
                  <Icon size={20} className={color} />
                </div>
                <div className="text-xs text-gray-500 font-mono">Agent {i + 1}</div>
                <h3 className="font-semibold text-white">{label}</h3>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Tech Stack</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {['React 18', 'Tailwind CSS', 'Zustand', 'Framer Motion', 'React Router',
            'FastAPI', 'WebSockets', 'Python 3.11', 'DuckDuckGo API', 'fpdf2', 'OpenAI (optional)'].map(tech => (
            <span key={tech} className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
