import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, ExternalLink } from 'lucide-react'
import axios from 'axios'

const confidenceColor = (c) =>
  c >= 0.75 ? 'text-green-400 bg-green-400/10 border-green-400/20'
  : c >= 0.5 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
  : 'text-red-400 bg-red-400/10 border-red-400/20'

const statusIcon = (s) =>
  s === 'Verified' ? '✅' : s === 'Partially Verified' ? '⚠️' : '❓'

export default function ReportDetail() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/reports/${id}`)
      .then(({ data }) => setReport(data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center py-20 text-gray-500">Loading report...</div>
  if (!report) return <div className="text-center py-20 text-red-400">Report not found</div>

  const pdfFile = report.pdf_path?.split('/')?.pop() || report.pdf_path?.split('\\')?.pop()

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link to="/history" className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{report.topic}</h1>
          <p className="text-gray-500 text-sm">{new Date(report.created_at).toLocaleString()}</p>
        </div>
        <a href={`/api/reports/${report.id}/download`}
          className="btn-primary text-sm flex items-center gap-2">
          <Download size={15} /> Download PDF
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className={`text-2xl font-bold ${report.overall_confidence >= 0.75 ? 'text-green-400' : report.overall_confidence >= 0.5 ? 'text-yellow-400' : 'text-red-400'}`}>
            {(report.overall_confidence * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-gray-500 mt-1">Confidence</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-400">{report.total_sources}</div>
          <div className="text-sm text-gray-500 mt-1">Sources</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-400">{report.verified_points?.length || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Key Findings</div>
        </div>
      </div>

      {/* Overview */}
      <div className="card space-y-2">
        <h2 className="font-semibold text-white">Executive Overview</h2>
        <p className="text-gray-400 leading-relaxed">{report.overview}</p>
      </div>

      {/* Verified Points */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-white">Fact-Check Results</h2>
        <div className="space-y-3">
          {report.verified_points?.map((vp, i) => (
            <div key={i} className="p-4 bg-gray-800 rounded-xl space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-base shrink-0 mt-0.5">{statusIcon(vp.status)}</span>
                <p className="text-gray-200">{vp.point}</p>
              </div>
              <div className="flex items-center gap-2 ml-7">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${confidenceColor(vp.confidence)}`}>
                  {(vp.confidence * 100).toFixed(0)}% confidence
                </span>
                <span className="text-xs text-gray-600">{vp.reason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Preview Link */}
      {pdfFile && (
        <div className="card flex items-center justify-between">
          <span className="text-gray-400 text-sm">PDF Report: {pdfFile}</span>
          <a href={`/output/${pdfFile}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
            <ExternalLink size={14} /> Preview in browser
          </a>
        </div>
      )}
    </div>
  )
}
