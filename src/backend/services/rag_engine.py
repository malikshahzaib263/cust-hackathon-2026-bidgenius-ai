import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

file_path = "data/Historical_Bid_Outcomes.xlsx"

cap_df = pd.read_excel(
    file_path,
    sheet_name="PS1 – Capability Library",
    header=2
)

cap_df = cap_df.fillna("")

cap_df["rag_text"] = (
    cap_df["Domain"].astype(str) + " " +
    cap_df["Project Summary"].astype(str) + " " +
    cap_df["Certification"].astype(str) + " " +
    cap_df["Client Type"].astype(str)
)

vectorizer = TfidfVectorizer(stop_words="english")
matrix = vectorizer.fit_transform(cap_df["rag_text"].tolist())


def safe_value(value):
    if pd.isna(value):
        return ""

    if hasattr(value, "item"):
        return value.item()

    return value


def rag_search(query, top_k=3):
    query_vec = vectorizer.transform([query])
    similarities = cosine_similarity(query_vec, matrix)[0]

    top_indices = similarities.argsort()[-top_k:][::-1]

    results = []

    for idx in top_indices:
        row = cap_df.iloc[int(idx)]

        results.append({
            "domain": str(safe_value(row["Domain"])),
            "project_summary": str(safe_value(row["Project Summary"])),
            "certification": str(safe_value(row["Certification"])),
            "year_completed": int(safe_value(row["Year Completed"])) if str(safe_value(row["Year Completed"])).strip() != "" else None,
            "contract_value": str(safe_value(row["Contract Value"])),
            "duration_months": int(safe_value(row["Duration (months)"])) if str(safe_value(row["Duration (months)"])).strip() != "" else None,
            "client_type": str(safe_value(row["Client Type"])),
            "similarity": round(float(similarities[int(idx)]), 3)
        })

    return results