"""
Simple in-memory database.
Replace with SQLite/PostgreSQL for production.
"""

db = {
    "jobs": {},     # job_id -> job status
    "reports": {}   # report_id -> full report data
}
