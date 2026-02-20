"""
Research Routes — REST + WebSocket endpoints
"""

import asyncio
import json
import uuid
from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

from agents.research_agent import ResearchAgent
from agents.summarizer_agent import SummarizerAgent
from agents.factcheck_agent import FactCheckAgent
from agents.report_agent import ReportAgent
from utils.db import db

router = APIRouter()


class ResearchRequest(BaseModel):
    topic: str


@router.post("/start")
async def start_research(req: ResearchRequest):
    """Start research and return a job_id for WebSocket tracking."""
    job_id = str(uuid.uuid4())[:8]
    db["jobs"][job_id] = {
        "id": job_id,
        "topic": req.topic,
        "status": "queued",
        "created_at": datetime.now().isoformat(),
        "result": None
    }
    return {"job_id": job_id, "topic": req.topic}


@router.websocket("/ws/{job_id}")
async def research_websocket(websocket: WebSocket, job_id: str):
    """WebSocket endpoint — streams real-time agent progress to frontend."""
    await websocket.accept()

    job = db["jobs"].get(job_id)
    if not job:
        await websocket.send_json({"type": "error", "message": "Job not found"})
        await websocket.close()
        return

    topic = job["topic"]

    async def emit(agent: str, message: str, progress: int, data=None):
        payload = {
            "type": "progress",
            "agent": agent,
            "message": message,
            "progress": progress,
            "timestamp": datetime.now().strftime("%H:%M:%S")
        }
        if data:
            payload["data"] = data
        await websocket.send_json(payload)
        await asyncio.sleep(0.3)

    try:
        db["jobs"][job_id]["status"] = "running"

        # ── Agent 1: Research ──────────────────────────────────
        await emit("ResearchAgent", f"🔍 Searching for '{topic}'...", 10)
        await asyncio.sleep(0.5)
        research_agent = ResearchAgent()
        raw_data = research_agent.run(topic)
        await emit("ResearchAgent", f"✅ Found {raw_data['total_sources']} sources", 25,
                   {"sources": raw_data["sources"]})

        # ── Agent 2: Summarizer ────────────────────────────────
        await emit("SummarizerAgent", "📝 Summarizing and extracting key points...", 40)
        await asyncio.sleep(0.5)
        summarizer = SummarizerAgent()
        summary = summarizer.run(raw_data)
        await emit("SummarizerAgent", f"✅ Generated {len(summary['key_points'])} key points", 55,
                   {"key_points": summary["key_points"], "overview": summary["overview"]})

        # ── Agent 3: Fact Check ────────────────────────────────
        await emit("FactCheckAgent", "🔎 Validating claims against sources...", 65)
        await asyncio.sleep(0.5)
        factcheck = FactCheckAgent()
        verified = factcheck.run(summary, raw_data)
        await emit("FactCheckAgent",
                   f"✅ Confidence: {verified['overall_confidence']:.0%} — {verified['verdict']}", 78,
                   {"verified_points": verified["verified_points"],
                    "overall_confidence": verified["overall_confidence"]})

        # ── Agent 4: Report ────────────────────────────────────
        await emit("ReportAgent", "📄 Generating PDF report...", 88)
        await asyncio.sleep(0.5)
        report_agent = ReportAgent()
        pdf_path = report_agent.run(topic, verified)

        # Save to DB
        report_record = {
            "id": job_id,
            "topic": topic,
            "created_at": datetime.now().isoformat(),
            "pdf_path": pdf_path,
            "overall_confidence": verified["overall_confidence"],
            "verdict": verified["verdict"],
            "total_sources": raw_data["total_sources"],
            "key_points": summary["key_points"],
            "overview": summary["overview"],
            "verified_points": verified["verified_points"]
        }
        db["reports"][job_id] = report_record
        db["jobs"][job_id]["status"] = "done"
        db["jobs"][job_id]["result"] = report_record

        await websocket.send_json({
            "type": "complete",
            "message": "✅ Report generated successfully!",
            "progress": 100,
            "report": report_record,
            "pdf_url": f"/output/{pdf_path.split('/')[-1]}"
        })

    except WebSocketDisconnect:
        db["jobs"][job_id]["status"] = "cancelled"
    except Exception as e:
        db["jobs"][job_id]["status"] = "error"
        await websocket.send_json({"type": "error", "message": str(e)})
    finally:
        await websocket.close()
