from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Dict, Any

from database import engine, get_db, Base
from models import Quote
from schemas import QuoteRequest, QuoteResponse, ErrorResponse
from ai_service import analyze_quote

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Faith-Quotient Analyzer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to Faith-Quotient Analyzer API"}


@app.post("/analyze", response_model=QuoteResponse, responses={500: {"model": ErrorResponse}})
def analyze_faith_quote(request: QuoteRequest, db: Session = Depends(get_db)):
    try:
        # Check if quote already exists in database
        existing_quote = db.query(Quote).filter(
            Quote.quote == request.quote,
            Quote.religion == request.religion
        ).first()
        
        if existing_quote:
            # Return cached result
            return {
                "quote": existing_quote.quote,
                "religion": existing_quote.religion,
                "analysis": existing_quote.analysis
            }
        
        # Analyze the quote using AI service
        result = analyze_quote(request.quote, request.religion)
        
        if not result:
            raise HTTPException(status_code=500, detail="Analysis service unavailable")
        
        # Save to database
        new_quote = Quote(
            quote=request.quote,
            religion=request.religion,
            analysis=result["analysis"]
        )
        
        db.add(new_quote)
        db.commit()
        db.refresh(new_quote)
        
        return result
        
    except Exception as e:
        if "database" in str(e).lower():
            raise HTTPException(status_code=500, detail="Database issue")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)