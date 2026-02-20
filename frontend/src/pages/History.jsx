import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Download, Trash2, ExternalLink, FileText } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const confidenceColor = (c) =>
  c >= 0.75 ? 'text-green-400' : c >= 0.5 ? 'text-yellow-400' : 'text-red-400'

export default function History() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    try {
      const { data } = await axios.get('/api/reports/')
      setReports(data.reports)
    } catch {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReports() }, [])

  const deleteReport = async (id) => {
    try {
      await axios.delete(`/api/reports/${id}`)
      setReports(prev => prev.filter(r => r.id !== id))
      toast.success('Report deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-500">Loading history...</div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Report History</h1>
          <p className="text-gray-400 mt-1">{reports.length} report{reports.length !== 1 ? 's' : ''} generated</p>
        </div>
        <Link to="/research" className="btn-primary text-sm">+ New Research</Link>
      </div>

      {reports.length === 0 ? (
        <div className="card text-center py-16 space-y-4">
          <FileText size={48} className="text-gray-700 mx-auto" />
          <p className="text-gray-500">No reports yet. Run your first research!</p>
          <Link to="/research" className="btn-primary inline-flex">Start Research</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map(report => (
            <div key={report.id} className="card hover:border-gray-700 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link to={`/report/${report.id}`}
                    className="font-semibold text-white hover:text-indigo-400 transition-colors text-lg">
                    {report.topic}
                  </Link>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{new Date(report.created_at).toLocaleString()}</span>
                    <span>{report.total_sources} sources</span>
                    <span className={`font-medium ${confidenceColor(report.overall_confidence)}`}>
                      {(report.overall_confidence * 100).toFixed(0)}% confidence
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-800 rounded-full">{report.verdict}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{report.overview}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/report/${report.id}`}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all">
                    <ExternalLink size={16} />
                  </Link>
                  <a href={`/api/reports/${report.id}/download`}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all">
                    <Download size={16} />
                  </a>
                  <button onClick={() => deleteReport(report.id)}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-red-900/50 text-gray-400 hover:text-red-400 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
