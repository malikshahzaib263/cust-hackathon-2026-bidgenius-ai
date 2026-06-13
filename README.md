
# BidGenius AI

🏆 CUST Hackathon 2026 Project

## AI-Powered Bid & Proposal Response Engine

BidGenius AI is an intelligent tender analysis platform that automates RFP processing, requirement extraction, compliance scoring, capability matching, win probability prediction, proposal generation, and tender Q&A.

---

## Problem Statement

Organizations spend significant time manually reviewing tender documents, identifying requirements, checking compliance, evaluating capabilities, and preparing proposal responses.

BidGenius AI automates this workflow using Artificial Intelligence, Machine Learning, RAG-based capability matching, and LLM-powered proposal generation.

---

## Features

* PDF Tender / RFP Upload
* Requirement Extraction
* NER-Based Information Extraction
* Capability Library Matching
* RAG-Based Evidence Retrieval
* Compliance Gap Analysis
* Compliance Scoring
* Win Probability Prediction
* GO / REVIEW / NO-GO Decision Support
* AI Proposal Generation
* Tender Chat Assistant
* Proposal Export

---

## System Workflow

RFP Upload

↓

PDF Text Extraction

↓

Requirement Extraction

↓

NER Processing

↓

Capability Matching

↓

Compliance Analysis

↓

Random Forest Prediction

↓

AI Proposal Generation

↓

Tender Chat Assistant

---

## Technologies Used

### Frontend

* React
* Vite
* Tailwind CSS
* Lucide Icons

### Backend

* FastAPI
* Python

### Artificial Intelligence

* DeepSeek Chat V3 (OpenRouter)
* Random Forest Classifier
* RapidFuzz Similarity Matching
* RAG-Based Evidence Matching

### Data Processing

* Pandas
* PyMuPDF
* Scikit-Learn

---

## Machine Learning Model

Random Forest Classifier is used for win probability prediction based on:

* Compliance Score
* Sector
* Budget
* Response Time
* Document Pages
* Gaps Found
* Historical Bid Performance

---

## Innovation

BidGenius AI combines:

* Requirement Extraction
* Compliance Analysis
* Capability Matching
* Win Prediction
* Proposal Generation

into a single intelligent platform, reducing manual effort and improving bid decision-making.

---

## Team

CUST Hackathon 2026

Team: BidGenius AI

Capital University of Science & Technology (CUST)

---

## Future Enhancements

* Vector Database Integration
* Multi-Language RFP Support
* Fine-Tuned Bid Intelligence Models
* Government Tender Portal Integration
* Collaborative Bid Management


## Run

```bash
npm install
npm run dev
```

Open: http://localhost:5173
