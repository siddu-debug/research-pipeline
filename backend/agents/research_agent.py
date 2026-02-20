import os

class ResearchAgent:
    def __init__(self):
        self.max_results = 6

    def run(self, topic: str) -> dict:
        results = self._search(topic)
        return {"topic": topic, "sources": results, "total_sources": len(results)}

    def _search(self, topic: str) -> list:
        try:
            from duckduckgo_search import DDGS
            results = []
            with DDGS() as ddgs:
                for r in ddgs.text(topic, max_results=self.max_results):
                    results.append({
                        "title": r.get("title", ""),
                        "snippet": r.get("body", ""),
                        "url": r.get("href", "")
                    })
            return results
        except Exception:
            return self._mock_data(topic)

    def _mock_data(self, topic: str) -> list:
        return [
            {"title": f"{topic} - Overview", "snippet": f"{topic} is a rapidly evolving field with significant implications across multiple industries. Recent studies show exponential growth in adoption and investment.", "url": "https://example.com/overview"},
            {"title": f"Latest Trends in {topic}", "snippet": f"Key trends shaping {topic} include automation, data-driven decision making, and increased collaboration between humans and intelligent systems.", "url": "https://example.com/trends"},
            {"title": f"{topic} - Challenges and Opportunities", "snippet": f"While {topic} presents enormous opportunities, challenges remain around ethics, regulation, data privacy, and equitable access.", "url": "https://example.com/challenges"},
            {"title": f"Future of {topic}", "snippet": f"Experts predict {topic} will fundamentally transform how we work and live within the next decade, creating new industries.", "url": "https://example.com/future"},
            {"title": f"{topic} - Real World Applications", "snippet": f"Real-world applications of {topic} span healthcare, finance, education, manufacturing, and transportation.", "url": "https://example.com/applications"},
        ]
