from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import joblib
import fitz
import pandas as pd

from services.rfp_extractor import extract_rfp_fields
from services.ner_extractor import extract_ner_fields
from services.rag_engine import rag_search
from services.compliance_calculator import calculate_compliance
from services.score_calculator import calculate_tender_score

app = FastAPI(
    title="BidGenius AI Backend",
    description="AI-powered Bid & Proposal Response Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

model = joblib.load("models/bid_win_random_forest.pkl")
sector_encoder = joblib.load("models/sector_encoder.pkl")


class BidInput(BaseModel):
    sector: str
    budget: float
    score: float
    response_time: float
    compliance: float
    doc_pages: int
    gaps_found: int


class AnalyzeBidInput(BaseModel):
    sector: str
    budget: float
    response_time: float
    doc_pages: int
    requirements: List[str]
    capability_score: float = 75
    evaluation_score: float = 80


def extract_pdf_text(file_path: str) -> str:
    doc = fitz.open(file_path)
    text = ""

    for page in doc:
        text += page.get_text()

    doc.close()
    return text


def get_decision(win_probability: float) -> str:
    if win_probability >= 70:
        return "GO"
    elif win_probability >= 50:
        return "REVIEW"
    return "NO-GO"


def safe_sector_encode(sector: str):
    known_sectors = list(sector_encoder.classes_)

    if sector in known_sectors:
        return sector_encoder.transform([sector])[0]

    return sector_encoder.transform([known_sectors[0]])[0]


@app.get("/")
def home():
    return {
        "message": "BidGenius AI Backend is running",
        "docs": "http://127.0.0.1:8000/docs",
        "modules": [
            "PDF Text Extraction",
            "NER Extraction",
            "RAG Capability Matching",
            "Compliance Scoring",
            "Random Forest Win Prediction",
            "GO / NO-GO Decision"
        ]
    }


@app.post("/predict-win")
def predict_win(data: BidInput):
    sector_encoded = safe_sector_encode(data.sector)

    X = pd.DataFrame([{
        "Sector_Encoded": sector_encoded,
        "Budget": data.budget,
        "Score (%)": data.score,
        "Response Time (hrs)": data.response_time,
        "Compliance %": data.compliance,
        "Doc Pages": data.doc_pages,
        "Gaps Found": data.gaps_found
    }])

    probability = model.predict_proba(X)[0][1]
    win_probability = round(float(probability) * 100, 2)

    return {
        "win_probability": win_probability,
        "decision": get_decision(win_probability)
    }


@app.post("/analyze-bid")
def analyze_bid(data: AnalyzeBidInput):
    compliance_result = calculate_compliance(data.requirements)

    compliance_score = compliance_result["compliance_score"]
    gaps_found = compliance_result["gaps_found"]

    tender_score = calculate_tender_score(
        compliance_score=compliance_score,
        capability_score=data.capability_score,
        evaluation_score=data.evaluation_score,
        gaps_found=gaps_found
    )

    sector_encoded = safe_sector_encode(data.sector)

    X = pd.DataFrame([{
        "Sector_Encoded": sector_encoded,
        "Budget": data.budget,
        "Score (%)": tender_score,
        "Response Time (hrs)": data.response_time,
        "Compliance %": compliance_score,
        "Doc Pages": data.doc_pages,
        "Gaps Found": gaps_found
    }])

    probability = model.predict_proba(X)[0][1]
    win_probability = round(float(probability) * 100, 2)

    rag_evidence = []
    for req in data.requirements:
        rag_evidence.append({
            "requirement": req,
            "matches": rag_search(req, top_k=3)
        })

    return {
        "requirements": data.requirements,
        "rag_evidence": rag_evidence,
        "compliance": compliance_result,
        "tender_score": tender_score,
        "win_probability": win_probability,
        "decision": get_decision(win_probability)
    }


@app.post("/upload-rfp")
async def upload_rfp(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Only PDF files are supported right now"}

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    extracted_text = extract_pdf_text(file_path)
    extracted_fields = extract_rfp_fields(extracted_text)
    ner_fields = extract_ner_fields(extracted_text)

    requirements = extracted_fields["requirements"]
    sector = ner_fields.get("sector") or extracted_fields["sector"]

    compliance_result = calculate_compliance(requirements)
    compliance_score = compliance_result["compliance_score"]
    gaps_found = compliance_result["gaps_found"]

    tender_score = calculate_tender_score(
        compliance_score=compliance_score,
        capability_score=75,
        evaluation_score=80,
        gaps_found=gaps_found
    )

    sector_encoded = safe_sector_encode(sector)
    doc_pages = max(1, round(len(extracted_text) / 1800))

    X = pd.DataFrame([{
        "Sector_Encoded": sector_encoded,
        "Budget": 50,
        "Score (%)": tender_score,
        "Response Time (hrs)": 24,
        "Compliance %": compliance_score,
        "Doc Pages": doc_pages,
        "Gaps Found": gaps_found
    }])

    probability = model.predict_proba(X)[0][1]
    win_probability = round(float(probability) * 100, 2)

    rag_evidence = []
    for req in requirements:
        rag_evidence.append({
            "requirement": req,
            "matches": rag_search(req, top_k=3)
        })

    return {
        "filename": file.filename,
        "characters": len(extracted_text),
        "doc_pages_estimated": doc_pages,
        "ner_fields": ner_fields,
        "deadline": ner_fields.get("deadline") or extracted_fields["deadline"],
        "sector": sector,
        "requirements_count": len(requirements),
        "requirements": requirements,
        "rag_evidence": rag_evidence,
        "compliance": compliance_result,
        "tender_score": tender_score,
        "win_probability": win_probability,
        "decision": get_decision(win_probability),
        "preview": extracted_text[:1000]
    }