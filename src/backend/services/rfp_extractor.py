import re


def clean_line(line):
    return re.sub(r"\s+", " ", line).strip()


def add_requirement(requirements, title, evidence_needed, source_text="", priority="domain"):
    for item in requirements:
        if item["requirement"] == title:
            if source_text and source_text not in item["source_text"]:
                item["source_text"].append(source_text)
            return

    requirements.append({
        "requirement": title,
        "evidence_needed": evidence_needed,
        "source_text": [source_text] if source_text else [],
        "priority": priority
    })


def detect_sector(text_lower):
    if any(k in text_lower for k in ["ifrs", "xbrl", "taxonomy", "financial reporting", "audit", "accounts"]):
        return "Finance"

    if any(k in text_lower for k in ["construction", "renovation", "fit-out", "civil works", "contractor", "building"]):
        return "Construction"

    if any(k in text_lower for k in ["software", "portal", "dashboard", "database", "erp", "cybersecurity", "application"]):
        return "IT Services"

    if any(k in text_lower for k in ["hospital", "medical", "patient", "healthcare", "clinic"]):
        return "Healthcare"

    if any(k in text_lower for k in ["school", "university", "training", "lms", "education"]):
        return "Education"

    if any(k in text_lower for k in ["fleet", "transport", "logistics", "warehouse"]):
        return "Logistics"

    if any(k in text_lower for k in ["solar", "power", "energy", "grid", "electric"]):
        return "Energy"

    if any(k in text_lower for k in ["telecom", "fiber", "network", "communication"]):
        return "Telecom"

    return "General"


def extract_rfp_fields(text):
    text_lower = text.lower()
    sector = detect_sector(text_lower)
    requirements = []

    rules = [
        # universal legal / admin
        (
            ["ntn", "gst", "sales tax", "income tax", "tax registration"],
            "Tax Registration Evidence Required",
            "Upload NTN, GST, sales tax, or income tax registration documents",
            "admin"
        ),
        (
            ["secp", "company registration", "firm registration", "registered with"],
            "Company Registration Evidence Required",
            "Upload SECP, firm registration, or company registration certificate",
            "admin"
        ),
        (
            ["bid security", "earnest money", "call deposit", "bank guarantee", "cdr"],
            "Bid Security Evidence Required",
            "Upload bid security, earnest money, CDR, or bank guarantee evidence",
            "admin"
        ),
        (
            ["technical proposal", "technical bid", "technical response"],
            "Technical Proposal Submission Required",
            "Upload technical proposal, methodology, work plan, and technical response document",
            "admin"
        ),
        (
            ["financial proposal", "financial bid", "price proposal", "boq", "cost breakdown"],
            "Financial Proposal Submission Required",
            "Upload financial proposal, BOQ, pricing schedule, or cost breakdown",
            "admin"
        ),
        (
            ["affidavit", "undertaking", "blacklisted", "blacklist", "declaration"],
            "Legal Declaration / Non-Blacklisting Evidence Required",
            "Upload affidavit, undertaking, non-blacklisting declaration, or legal compliance statement",
            "admin"
        ),

        # universal capability
        (
            ["experience", "similar project", "past performance", "completion certificate"],
            "Relevant Experience Evidence Required",
            "Upload similar project references, completion certificates, or past performance evidence",
            "domain"
        ),
        (
            ["team cv", "team cvs", "key staff", "project manager", "team lead", "expert"],
            "Team CVs and Key Staff Evidence Required",
            "Upload CVs of key staff, project manager, technical lead, and relevant experts",
            "domain"
        ),
        (
            ["methodology", "work plan", "implementation plan", "approach"],
            "Methodology and Work Plan Required",
            "Upload methodology, work plan, implementation plan, and delivery approach",
            "domain"
        ),
        (
            ["certification", "certified", "iso", "pmp", "quality certification"],
            "Professional Certification Evidence Required",
            "Upload ISO, PMP, quality, security, or domain-specific certification evidence",
            "domain"
        ),

        # sector-specific
        (
            ["ifrs", "xbrl", "taxonomy", "financial reporting"],
            "IFRS / XBRL Taxonomy Expertise Required",
            "Upload IFRS, XBRL, taxonomy, or financial reporting consultancy project evidence",
            "domain"
        ),
        (
            ["audit", "audited accounts", "financial statements", "annual turnover"],
            "Financial Strength Evidence Required",
            "Upload audited accounts, financial statements, turnover evidence, or bank statements",
            "domain"
        ),
        (
            ["software", "portal", "dashboard", "database", "application", "system"],
            "Software / System Development Experience Required",
            "Upload software, portal, dashboard, database, or system implementation evidence",
            "domain"
        ),
        (
            ["cybersecurity", "security", "iso 27001"],
            "Cybersecurity / Information Security Evidence Required",
            "Upload cybersecurity, ISO 27001, security audit, or information security project evidence",
            "domain"
        ),
        (
            ["erp", "enterprise resource"],
            "ERP Implementation Experience Required",
            "Upload ERP implementation, integration, or enterprise software project evidence",
            "domain"
        ),
        (
            ["construction", "civil works", "building", "contractor"],
            "Construction / Civil Works Experience Required",
            "Upload construction, civil works, building, or contractor project evidence",
            "domain"
        ),
        (
            ["renovation", "fit-out", "refurbishment", "repair"],
            "Renovation / Fit-Out Experience Required",
            "Upload renovation, fit-out, refurbishment, or repair works evidence",
            "domain"
        ),
        (
            ["pec", "engineering"],
            "Engineering / PEC Registration Evidence Required",
            "Upload PEC registration, engineering license, or relevant contractor certification",
            "domain"
        ),
        (
            ["hospital", "clinic", "medical", "patient", "healthcare"],
            "Healthcare Domain Experience Required",
            "Upload healthcare, hospital, clinic, or patient service project evidence",
            "domain"
        ),
        (
            ["fleet", "transport", "logistics", "warehouse"],
            "Logistics / Fleet Management Experience Required",
            "Upload logistics, fleet, warehouse, transport, or supply chain project evidence",
            "domain"
        ),
        (
            ["solar", "power", "energy", "grid", "renewable"],
            "Energy / Power Sector Experience Required",
            "Upload solar, power, grid, or renewable energy project evidence",
            "domain"
        ),
    ]

    bad_phrases = [
        "table of contents",
        "shall prevail",
        "decision shall be final",
        "decision of",
        "cost of preparation",
        "shall not be responsible",
        "reference the rfp number",
        "proposal shall be opened",
        "invites sealed proposals",
        "terms and conditions",
        "may ask for clarification",
    ]

    chunks = [clean_line(c) for c in re.split(r"[\n•]+", text)]
    chunks = [c for c in chunks if 25 <= len(c) <= 400]

    for chunk in chunks:
        lower = chunk.lower()

        if any(bad in lower for bad in bad_phrases):
            continue

        for keywords, title, evidence, priority in rules:
            if any(k in lower for k in keywords):
                add_requirement(requirements, title, evidence, chunk, priority)

    if len(requirements) == 0:
        add_requirement(
            requirements,
            f"{sector} Compliance Evidence Required",
            f"Upload relevant {sector} compliance documents, project evidence, and eligibility proof",
            "No strong structured compliance clauses were detected automatically.",
            "domain"
        )

    deadline = None
    deadline_patterns = [
        r"closing date of rfp[:\s]+([^\n]+)",
        r"last date for queries[:\s]+([^\n]+)",
        r"within\s+(\d+)\s+days\s+of\s+publication",
        r"([0-9]{1,2}(st|nd|rd|th)?\s+[a-zA-Z]+\s+[0-9]{4})",
    ]

    for pattern in deadline_patterns:
        match = re.search(pattern, text_lower)
        if match:
            if "within" in pattern:
                deadline = f"Within {match.group(1)} days of publication"
            else:
                deadline = clean_line(match.group(1))
            break

    return {
        "requirements": [r["requirement"] for r in requirements[:12]],
        "requirement_details": requirements[:12],
        "deadline": deadline,
        "sector": sector if sector != "General" else "IT Services",
    }