import { create } from 'zustand'

export const useResearchStore = create((set, get) => ({
  // State
  topic: '',
  status: 'idle',        // idle | connecting | running | done | error
  progress: 0,
  logs: [],
  sources: [],
  keyPoints: [],
  overview: '',
  verifiedPoints: [],
  overallConfidence: 0,
  verdict: '',
  report: null,
  pdfUrl: null,
  error: null,
  ws: null,

  // Actions
  setTopic: (topic) => set({ topic }),

  reset: () => set({
    status: 'idle', progress: 0, logs: [], sources: [], keyPoints: [],
    overview: '', verifiedPoints: [], overallConfidence: 0, verdict: '',
    report: null, pdfUrl: null, error: null
  }),

  startResearch: async (topic) => {
    const { reset } = get()
    reset()
    set({ status: 'connecting', topic })

    try {
      // POST to get job_id
      const res = await fetch('/api/research/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })
      const { job_id } = await res.json()

      // Connect WebSocket
      const wsUrl = `ws://localhost:8000/api/research/ws/${job_id}`
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => set({ status: 'running' })

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        const state = get()

        if (msg.type === 'progress') {
          const log = { agent: msg.agent, message: msg.message, timestamp: msg.timestamp }
          set({
            progress: msg.progress,
            logs: [...state.logs, log],
          })
          if (msg.data?.sources)  set({ sources: msg.data.sources })
          if (msg.data?.key_points) set({ keyPoints: msg.data.key_points, overview: msg.data.overview })
          if (msg.data?.verified_points) set({
            verifiedPoints: msg.data.verified_points,
            overallConfidence: msg.data.overall_confidence
          })
        }

        if (msg.type === 'complete') {
          set({
            status: 'done',
            progress: 100,
            report: msg.report,
            pdfUrl: msg.pdf_url,
            verdict: msg.report.verdict,
            overallConfidence: msg.report.overall_confidence,
            logs: [...get().logs, { agent: 'System', message: msg.message, timestamp: new Date().toLocaleTimeString() }]
          })
        }

        if (msg.type === 'error') {
          set({ status: 'error', error: msg.message })
        }
      }

      ws.onerror = () => set({ status: 'error', error: 'WebSocket connection failed' })
      ws.onclose = () => { if (get().status === 'running') set({ status: 'error', error: 'Connection closed unexpectedly' }) }

      set({ ws })
    } catch (err) {
      set({ status: 'error', error: err.message })
    }
  }
}))
