"""
Reports Routes — CRUD for saved reports
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
from utils.db import db

router = APIRouter()


@router.get("/")
def get_all_reports():
    """Return all saved reports (history)."""
    reports = list(db["reports"].values())
    reports.sort(key=lambda r: r["created_at"], reverse=True)
    return {"reports": reports, "total": len(reports)}


@router.get("/{report_id}")
def get_report(report_id: str):
    """Get a single report by ID."""
    report = db["reports"].get(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.delete("/{report_id}")
def delete_report(report_id: str):
    """Delete a report."""
    if report_id not in db["reports"]:
        raise HTTPException(status_code=404, detail="Report not found")
    report = db["reports"].pop(report_id)
    # Remove PDF file
    if os.path.exists(report["pdf_path"]):
        os.remove(report["pdf_path"])
    return {"message": "Report deleted"}


@router.get("/{report_id}/download")
def download_report(report_id: str):
    """Download PDF for a report."""
    report = db["reports"].get(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    path = report["pdf_path"]
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="PDF file not found")
    return FileResponse(path, media_type="application/pdf",
                        filename=f"report_{report_id}.pdf")
