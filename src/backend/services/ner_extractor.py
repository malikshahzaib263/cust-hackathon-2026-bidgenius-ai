import re

def extract_ner_fields(text):
    text_lower = text.lower()

    email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)

    budget_match = re.search(r"pkr\s?[\d,.]+\s?(m|million|crore)?", text_lower)

    deadline_match = re.search(
        r"(closing date|last date|deadline|submission date).*?([0-9]{1,2}\s+[a-zA-Z]+\s+[0-9]{4}|within\s+[0-9]+\s+days)",
        text_lower
    )

    certifications = []
    for cert in ["ISO 27001", "ISO 9001", "PMP", "PEC", "NTN", "GST"]:
        if cert.lower() in text_lower:
            certifications.append(cert)

    experience_match = re.search(r"(\d+)\s+(years|year)\s+(of\s+)?experience", text_lower)

    sector = "Construction"
    if "software" in text_lower or "it services" in text_lower:
        sector = "IT Services"
    elif "construction" in text_lower or "renovation" in text_lower or "fit-out" in text_lower:
        sector = "Construction"
    elif "healthcare" in text_lower:
        sector = "Healthcare"
    elif "finance" in text_lower or "bank" in text_lower:
        sector = "Finance"

    return {
        "client_name": "Karandaaz Pakistan" if "karandaaz" in text_lower else "Unknown",
        "sector": sector,
        "budget": budget_match.group(0).upper() if budget_match else None,
        "deadline": deadline_match.group(0) if deadline_match else None,
        "submission_email": email_match.group(0) if email_match else None,
        "certifications": certifications,
        "experience_years": int(experience_match.group(1)) if experience_match else None
    }