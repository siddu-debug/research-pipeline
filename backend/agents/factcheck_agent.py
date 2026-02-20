import re

class FactCheckAgent:
    def run(self, summary: dict, raw_data: dict) -> dict:
        source_text = " ".join([s["snippet"].lower() for s in raw_data["sources"]])
        verified_points = []
        for point in summary["key_points"]:
            score = self._score(point, source_text)
            verified_points.append({"point": point, **score})
        avg = sum(p["confidence"] for p in verified_points) / max(len(verified_points), 1)
        return {
            "topic": summary["topic"],
            "overview": summary["overview"],
            "verified_points": verified_points,
            "overall_confidence": round(avg, 2),
            "total_sources": summary["total_sources"],
            "verdict": "HIGH CONFIDENCE" if avg >= 0.75 else "MODERATE CONFIDENCE" if avg >= 0.5 else "LOW CONFIDENCE"
        }

    def _score(self, point, source_text):
        words = re.findall(r'\b[a-zA-Z]{4,}\b', point.lower())
        if not words:
            return {"confidence": 0.5, "status": "Unverified", "reason": "No checkable content"}
        matches = sum(1 for w in words if w in source_text)
        ratio = matches / len(words)
        if ratio >= 0.6:
            return {"confidence": round(0.75 + ratio * 0.25, 2), "status": "Verified", "reason": f"{matches}/{len(words)} keywords found"}
        elif ratio >= 0.3:
            return {"confidence": round(0.4 + ratio * 0.5, 2), "status": "Partially Verified", "reason": f"{matches}/{len(words)} keywords found"}
        else:
            return {"confidence": round(ratio * 0.5, 2), "status": "Uncertain", "reason": f"Only {matches}/{len(words)} keywords found"}
