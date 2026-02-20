import os
from datetime import datetime

class ReportAgent:
    def __init__(self):
        os.makedirs("output", exist_ok=True)

    def run(self, topic: str, data: dict) -> str:
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe = "".join(c if c.isalnum() or c == '_' else '_' for c in topic)[:40]
        filename = f"output/report_{safe}_{ts}.pdf"
        try:
            self._pdf(filename, topic, data)
        except ImportError:
            filename = filename.replace(".pdf", ".txt")
            self._txt(filename, topic, data)
        return filename

    def _pdf(self, filename, topic, data):
        from fpdf import FPDF
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()

        pdf.set_fill_color(17, 24, 39)
        pdf.rect(0, 0, 210, 42, 'F')
        pdf.set_font("Helvetica", "B", 18)
        pdf.set_text_color(99, 179, 237)
        pdf.set_xy(15, 8)
        pdf.cell(0, 10, "RESEARCH INTELLIGENCE REPORT", ln=True)
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(203, 213, 225)
        pdf.set_xy(15, 20)
        pdf.cell(0, 6, f"Topic: {topic}", ln=True)
        pdf.set_xy(15, 28)
        pdf.cell(0, 6, f"Generated: {datetime.now().strftime('%B %d, %Y at %H:%M')}  |  Sources: {data['total_sources']}  |  Confidence: {data['overall_confidence']:.0%}", ln=True)

        confidence = data["overall_confidence"]
        c = (34, 197, 94) if confidence >= 0.75 else (251, 191, 36) if confidence >= 0.5 else (239, 68, 68)
        pdf.set_fill_color(*c)
        pdf.rect(148, 48, 52, 14, 'F')
        pdf.set_text_color(255, 255, 255)
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_xy(148, 51)
        pdf.cell(52, 8, f"{confidence:.0%}  {data['verdict'].split()[0]}", align='C', ln=True)

        pdf.set_text_color(17, 24, 39)
        pdf.set_xy(15, 50)
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(17, 24, 39)
        pdf.cell(0, 7, "Executive Overview", ln=True)
        pdf.set_draw_color(99, 102, 241)
        pdf.line(15, pdf.get_y(), 130, pdf.get_y())
        pdf.ln(3)
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(55, 65, 81)
        pdf.set_x(15)
        pdf.multi_cell(125, 6, data["overview"])
        pdf.ln(5)

        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(17, 24, 39)
        pdf.set_x(15)
        pdf.cell(0, 7, "Key Findings & Fact-Check Results", ln=True)
        pdf.set_draw_color(99, 102, 241)
        pdf.line(15, pdf.get_y(), 195, pdf.get_y())
        pdf.ln(4)

        for i, vp in enumerate(data["verified_points"], 1):
            if pdf.get_y() > 260:
                pdf.add_page()
            status = vp["status"]
            bg = (240, 253, 244) if status == "Verified" else (255, 251, 235) if status == "Partially Verified" else (255, 241, 242)
            pdf.set_fill_color(*bg)
            pdf.rect(14, pdf.get_y() - 1, 182, 22, 'F')
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(99, 102, 241)
            pdf.set_xy(16, pdf.get_y())
            pdf.cell(10, 6, f"{i}.")
            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(30, 30, 30)
            pdf.set_xy(24, pdf.get_y())
            pdf.multi_cell(155, 5, vp["point"])
            pdf.set_font("Helvetica", "I", 8)
            pdf.set_text_color(107, 114, 128)
            pdf.set_x(24)
            icon = "✓" if status == "Verified" else "~" if status == "Partially Verified" else "?"
            pdf.cell(0, 5, f"{icon} {status}  |  Confidence: {vp['confidence']:.0%}  |  {vp['reason']}", ln=True)
            pdf.ln(3)

        pdf.set_y(-18)
        pdf.set_fill_color(17, 24, 39)
        pdf.rect(0, pdf.get_y(), 210, 18, 'F')
        pdf.set_font("Helvetica", "I", 8)
        pdf.set_text_color(148, 163, 184)
        pdf.cell(0, 10, f"Multi-Agent Research Pipeline  |  {datetime.now().strftime('%Y-%m-%d')}", align='C')
        pdf.output(filename)

    def _txt(self, filename, topic, data):
        lines = ["="*60, f"  RESEARCH REPORT: {topic}",
                 f"  Confidence: {data['overall_confidence']:.0%} — {data['verdict']}", "="*60, "",
                 "OVERVIEW", "-"*40, data["overview"], "", "KEY FINDINGS", "-"*40]
        for i, vp in enumerate(data["verified_points"], 1):
            lines += [f"\n{i}. {vp['point']}", f"   {vp['status']} | {vp['confidence']:.0%} | {vp['reason']}"]
        with open(filename, 'w') as f:
            f.write('\n'.join(lines))
