# 🤖 Multi-Agent Research Pipeline — Full Stack

A production-grade full stack web app with 4 AI agents that research, summarize, fact-check, and generate PDF reports in real-time.

---

## 🏗 Folder Structure

```
research_pipeline/
├── backend/                     ← FastAPI Python backend
│   ├── main.py                  ← FastAPI app entry
│   ├── requirements.txt
│   ├── agents/
│   │   ├── research_agent.py    ← Agent 1: Web search
│   │   ├── summarizer_agent.py  ← Agent 2: Key point extraction
│   │   ├── factcheck_agent.py   ← Agent 3: Confidence scoring
│   │   └── report_agent.py      ← Agent 4: PDF generation
│   ├── routes/
│   │   ├── research.py          ← POST /start + WebSocket /ws/{id}
│   │   └── reports.py           ← GET/DELETE reports history
│   └── utils/
│       └── db.py                ← In-memory store
│
└── frontend/                    ← React + Vite + Tailwind frontend
    ├── src/
    │   ├── App.jsx
    │   ├── pages/
    │   │   ├── Home.jsx         ← Landing + tech stack
    │   │   ├── Research.jsx     ← Live pipeline runner
    │   │   ├── History.jsx      ← All past reports
    │   │   └── ReportDetail.jsx ← Single report view
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── AgentTimeline.jsx ← Live agent status sidebar
    │   │   ├── ProgressBar.jsx
    │   │   └── ResultsPanel.jsx  ← Streaming results
    │   └── store/
    │       └── researchStore.js  ← Zustand global state
    └── package.json
```

---

## 🚀 Setup & Run

### Terminal 1 — Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev
```

### Open in browser
```
http://localhost:5173
```

---

## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| State | Zustand |
| Routing | React Router v6 |
| Animation | Framer Motion |
| Backend | FastAPI (Python) |
| Real-time | WebSockets |
| Web Search | DuckDuckGo Search (free) |
| PDF | fpdf2 |
| AI (optional) | OpenAI GPT-3.5 |

---

## ⚙️ Optional: OpenAI AI Summarization
Create `backend/.env`:
```
OPENAI_API_KEY=sk-your-key-here
```

---

## 📝 Resume Description
> Architected a full stack multi-agent AI research platform with React + FastAPI, featuring real-time WebSocket streaming of 4 autonomous agents (Research, Summarizer, Fact-Check, Report Generator). Implemented Zustand state management, live progress visualization, PDF generation, and a report history dashboard.
