from fastapi import APIRouter, HTTPException, Query, Response
from app.services.brief_pdf import generate_village_brief_pdf

router = APIRouter(prefix="/villages", tags=["pdf brief"])

@router.get("/{id}/brief.pdf")
def get_village_brief_pdf(id: str, season: str = Query("2027-pre-summer", description="Target forecast season")):
    try:
        pdf_bytes = generate_village_brief_pdf(village_id=id, season=season)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"inline; filename=water_brief_{id}_{season}.pdf"
            }
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail={"error": str(e), "code": "NOT_FOUND"})
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail={"error": str(e), "code": "DATA_MISSING"})
