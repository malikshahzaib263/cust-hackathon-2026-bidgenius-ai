import pandas as pd
from rapidfuzz import fuzz

cap_df = pd.read_excel(
    "data/Historical_Bid_Outcomes.xlsx",
    sheet_name="PS1 – Capability Library",
    header=2
)

cap_df = cap_df.fillna("")


def safe_value(value):
    if pd.isna(value):
        return ""
    if hasattr(value, "item"):
        return value.item()
    return value


def row_to_match(row, score):
    return {
        "domain": str(safe_value(row["Domain"])),
        "project": str(safe_value(row["Project Summary"])),
        "certification": str(safe_value(row["Certification"])),
        "year_completed": int(safe_value(row["Year Completed"])) if str(safe_value(row["Year Completed"])).strip() else None,
        "contract_value": str(safe_value(row["Contract Value"])),
        "duration_months": int(safe_value(row["Duration (months)"])) if str(safe_value(row["Duration (months)"])).strip() else None,
        "client_type": str(safe_value(row["Client Type"])),
        "score": round(float(score), 2)
    }


def universal_fallback_match(requirement):
    req = requirement.lower()
    matches = []

    for _, row in cap_df.iterrows():
        text = f"{row['Domain']} {row['Project Summary']} {row['Certification']} {row['Client Type']}".lower()

        score = 0

        if "technical proposal" in req:
            score = 70

        elif "financial proposal" in req:
            score = 65

        elif "submission format" in req:
            score = 60

        elif "tax registration" in req:
            score = 60

        elif "company registration" in req:
            score = 60

        elif "ifrs" in req or "xbrl" in req or "taxonomy" in req:
            if any(k in text for k in ["finance", "financial", "audit", "erp", "consulting"]):
                score = 72

        elif "construction" in req or "renovation" in req:
            if any(k in text for k in ["construction", "road", "bridge", "engineering"]):
                score = 78

        elif "transaction advisory" in req or "feasibility" in req:
            if any(k in text for k in ["construction", "engineering", "finance", "consulting", "erp"]):
                score = 68

        elif "experience" in req:
            score = 65

        elif "certification" in req:
            if str(row["Certification"]).strip():
                score = 75

        if score > 0:
            matches.append(row_to_match(row, score))

    matches.sort(key=lambda x: x["score"], reverse=True)
    return matches[:3]


def find_matches(requirement):
    matches = []

    for _, row in cap_df.iterrows():
        text = f"""
        {row['Domain']} {row['Domain']} {row['Domain']}
        {row['Project Summary']}
        {row['Certification']}
        {row['Client Type']}
        """

        score = fuzz.partial_ratio(
            requirement.lower(),
            str(text).lower()
        )

        if score > 45:
            matches.append(row_to_match(row, score))

    if len(matches) == 0:
        matches = universal_fallback_match(requirement)

    matches.sort(key=lambda x: x["score"], reverse=True)
    return matches[:3]