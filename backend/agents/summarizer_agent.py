import os

class SummarizerAgent:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "")

    def run(self, research_data: dict) -> dict:
        topic = research_data["topic"]
        sources = research_data["sources"]
        if self.api_key:
            summary = self._summarize_with_ai(topic, sources)
        else:
            summary = self._summarize_extractive(topic, sources)
        return {"topic": topic, "key_points": summary["key_points"],
                "overview": summary["overview"], "total_sources": research_data["total_sources"]}

    def _summarize_with_ai(self, topic, sources):
        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.api_key)
            combined = "\n\n".join([f"Source: {s['title']}\n{s['snippet']}" for s in sources])
            prompt = f"""Summarize research on "{topic}".
Sources:\n{combined}

Respond EXACTLY in this format:
OVERVIEW: [2-3 sentence overview]
KEY_POINTS:
- [point 1]
- [point 2]
- [point 3]
- [point 4]
- [point 5]"""
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            return self._parse(response.choices[0].message.content)
        except Exception:
            return self._summarize_extractive(topic, sources)

    def _summarize_extractive(self, topic, sources):
        snippets = [s["snippet"] for s in sources if s["snippet"]]
        overview = snippets[0] if snippets else f"Research summary on {topic}."
        key_points = []
        for snippet in snippets[1:]:
            sentences = [s.strip() for s in snippet.split('.') if len(s.strip()) > 30]
            if sentences:
                key_points.append(sentences[0] + '.')
        while len(key_points) < 3:
            key_points.append(f"Further research on {topic} reveals growing importance across multiple domains.")
        return {"overview": overview, "key_points": key_points[:6]}

    def _parse(self, text):
        overview = ""
        key_points = []
        in_points = False
        for line in text.strip().split('\n'):
            if line.startswith("OVERVIEW:"):
                overview = line.replace("OVERVIEW:", "").strip()
            elif line.startswith("KEY_POINTS:"):
                in_points = True
            elif in_points and line.strip().startswith("-"):
                p = line.strip().lstrip("- ").strip()
                if p:
                    key_points.append(p)
        return {"overview": overview, "key_points": key_points}
