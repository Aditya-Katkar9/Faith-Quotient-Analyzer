from pydantic import BaseModel
from typing import Dict, List, Optional, Any


class QuoteRequest(BaseModel):
    quote: str
    religion: str


class QuoteResponse(BaseModel):
    quote: str
    religion: str
    analysis: Dict[str, Any]


class ErrorResponse(BaseModel):
    error: str