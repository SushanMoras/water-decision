import io
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
    KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

from app.loaders.real_loader import get_loader
from app.services.forecast import predict_groundwater
from app.services.recommender import get_top_actions

DISCLAIMER_TEXT = "Decision support, not a substitute for expert advice."

class NumberedCanvas(canvas.Canvas):
    """Canvas that draws the SAMPLE DATA watermark and footer disclaimer."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.is_sample = kwargs.get("is_sample", True)

    def draw_watermark(self):
        if getattr(self, "is_sample", True):
            self.saveState()
            self.setFont("Helvetica-Bold", 54)
            self.setFillColor(colors.Color(0.85, 0.85, 0.85, alpha=0.35))
            self.translate(A4[0] / 2, A4[1] / 2)
            self.rotate(45)
            self.drawCentredString(0, 0, "SAMPLE DATA - NOT REAL")
            self.restoreState()

    def showPage(self):
        self.draw_watermark()
        super().showPage()

def generate_trend_chart_image(history: list, forecast_val: float) -> io.BytesIO:
    """Generates a small matplotlib groundwater trend chart image."""
    dates = [h["date"] for h in history[-12:]]
    levels = [h["level_bgl_m"] for h in history[-12:]]
    
    # Append forecast point
    proj_dates = dates + ["2027 Proj"]
    proj_levels = levels + [forecast_val]
    
    fig, ax = plt.subplots(figsize=(6.2, 1.8), dpi=150)
    fig.patch.set_facecolor('#f8fafc')
    ax.set_facecolor('#ffffff')
    
    ax.plot(range(len(dates)), levels, color='#0284c7', marker='o', markersize=3.5, linewidth=1.5, label='Historical (m bgl)')
    ax.plot([len(dates)-1, len(proj_dates)-1], [levels[-1], forecast_val], color='#dc2626', linestyle='--', marker='s', markersize=4.5, linewidth=1.5, label='Projected')
    
    ax.set_ylabel('Depth (m bgl)', fontsize=7.5, color='#334155')
    ax.invert_yaxis()  # Deeper water is further down
    ax.grid(True, linestyle=':', alpha=0.5, color='#cbd5e1')
    ax.tick_params(axis='both', which='major', labelsize=6.5)
    
    # Select subset of tick marks
    step = max(1, len(proj_dates) // 5)
    tick_indices = list(range(0, len(proj_dates), step))
    if len(proj_dates)-1 not in tick_indices:
        tick_indices.append(len(proj_dates)-1)
    ax.set_xticks(tick_indices)
    ax.set_xticklabels([proj_dates[i] for i in tick_indices], rotation=0, fontsize=6.5)
    
    ax.legend(loc='upper right', fontsize=6.5, framealpha=0.8)
    plt.tight_layout(pad=0.5)
    
    img_buf = io.BytesIO()
    plt.savefig(img_buf, format='png', bbox_inches='tight')
    plt.close(fig)
    img_buf.seek(0)
    return img_buf

def generate_village_brief_pdf(village_id: str, season: str = "2027-pre-summer") -> bytes:
    loader = get_loader()
    village = loader.get_village(village_id)
    if not village:
        raise ValueError(f"Village {village_id} not found")
        
    forecast = predict_groundwater(village_id, season)
    actions = get_top_actions(village_id, season)
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=26,
        rightMargin=26,
        topMargin=22,
        bottomMargin=22
    )
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Heading1'],
        fontSize=15,
        leading=17,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=1
    )
    sub_style = ParagraphStyle(
        'SubHeader',
        parent=styles['Normal'],
        fontSize=8.5,
        leading=10,
        textColor=colors.HexColor('#475569')
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#1e293b')
    )
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontSize=6.5,
        leading=8,
        textColor=colors.HexColor('#64748b'),
        alignment=1
    )

    elements = []
    
    # 1. Header & Location Information
    stress_colors = {
        "critical": "#ef4444",
        "stressed": "#f97316",
        "watch": "#eab308",
        "safe": "#22c55e",
        "unknown": "#94a3b8"
    }
    s_col = stress_colors.get(village.get("stress_class", "unknown"), "#94a3b8")
    
    stress_badge = f'<font color="{s_col}"><b>[{village.get("stress_class", "UNKNOWN").upper()} STRESS]</b></font>'
    header_p = Paragraph(f"<b>Village Water Security Brief: {village['name']}</b> {stress_badge}", title_style)
    sub_p = Paragraph(f"District: <b>{village['district']}</b> | Block: <b>{village['block']}</b> | Target Season: <b>{season}</b> | Population: {village.get('population', 'N/A')}", sub_style)
    elements.extend([header_p, sub_p, Spacer(1, 5)])

    # 2. Key Metrics Table (Groundwater Depth & Water Balance)
    wl = forecast.water_level_bgl
    bal = forecast.balance_ml
    sup = forecast.supply_ml
    dem = forecast.demand_ml
    
    metrics_data = [
        [
            Paragraph(f"<b>Projected Depth to Water:</b><br/>{wl.mid:.2f} m bgl <font size=6 color='#64748b'>({wl.low:.1f} to {wl.high:.1f} m)</font>", body_style),
            Paragraph(f"<b>Seasonal Water Balance:</b><br/><b><font color='{'#b91c1c' if bal.mid < 0 else '#15803d'}'>{bal.mid:+.1f} ML</font></b> <font size=6 color='#64748b'>({bal.low:+.1f} to {bal.high:+.1f} ML)</font>", body_style),
            Paragraph(f"<b>Supply vs Demand:</b><br/>Supply: {sup.mid:.0f} ML | Demand: {dem.mid:.0f} ML", body_style),
            Paragraph(f"<b>Data Confidence:</b><br/><b>{forecast.confidence.level.upper()}</b> ({forecast.confidence.wells_used} wells)", body_style)
        ]
    ]
    t_metrics = Table(metrics_data, colWidths=[135, 145, 145, 115])
    t_metrics.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f1f5f9')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.extend([t_metrics, Spacer(1, 4)])

    # 3. Water Level Trend Chart
    chart_buf = generate_trend_chart_image(forecast.history, wl.mid)
    chart_img = Image(chart_buf, width=540, height=130)
    elements.extend([chart_img, Spacer(1, 4)])

    # 4. Top Recommended Interventions
    elements.append(Paragraph("<b>Top Priority Water Interventions</b>", sub_style))
    action_rows = [
        [
            Paragraph("<b>#</b>", body_style),
            Paragraph("<b>Intervention Action</b>", body_style),
            Paragraph("<b>Expected Water Effect</b>", body_style),
            Paragraph("<b>Cost</b>", body_style),
            Paragraph("<b>Rationale / Why</b>", body_style),
        ]
    ]
    for act in actions[:3]:
        ef = act.expected_water_effect_ml
        action_rows.append([
            Paragraph(str(act.rank), body_style),
            Paragraph(f"<b>{act.title}</b>", body_style),
            Paragraph(f"{ef.mid:.0f} ML <font size=5.5 color='#64748b'>({ef.low:.0f}-{ef.high:.0f})</font>", body_style),
            Paragraph(act.cost_level.capitalize(), body_style),
            Paragraph(act.why, body_style)
        ])
    t_actions = Table(action_rows, colWidths=[18, 145, 80, 45, 252])
    t_actions.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#f1f5f9')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.extend([t_actions, Spacer(1, 5)])

    # 5. Confidence, Sources & Legal Disclaimer
    conf_reasons = "; ".join(forecast.confidence.reasons)
    conf_line = Paragraph(f"<b>Confidence Assessment:</b> {forecast.confidence.level.upper()} level based on {forecast.confidence.wells_used} wells within 10 km. Latest observation: {forecast.confidence.last_reading_date}. Factors: {conf_reasons}", body_style)
    
    src_names = [f"{s.name} ({s.url})" for s in forecast.sources]
    src_line = Paragraph(f"<b>Data Sources:</b> {'; '.join(src_names)}", body_style)
    
    disclaimer_p = Paragraph(f"<b>DISCLAIMER:</b> {DISCLAIMER_TEXT} Calculations are for planning estimation only.", disclaimer_style)
    
    elements.extend([conf_line, Spacer(1, 2), src_line, Spacer(1, 4), disclaimer_p])

    # Build canvas with custom watermark handling
    def make_canvas(*args, **kwargs):
        c = NumberedCanvas(*args, **kwargs)
        c.is_sample = village.get("is_sample", True)
        return c

    doc.build(elements, canvasmaker=make_canvas)
    buffer.seek(0)
    return buffer.getvalue()
