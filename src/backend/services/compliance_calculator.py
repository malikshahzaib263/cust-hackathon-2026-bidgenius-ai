from services.capability_matcher import find_matches


def calculate_compliance(requirements):
    matched = 0
    gaps = []
    matched_items = []

    for req in requirements:
        matches = find_matches(req)

        if len(matches) > 0:
            matched += 1
            matched_items.append({
                "requirement": req,
                "evidence": matches[:2]
            })
        else:
            gaps.append(req)

    if len(requirements) == 0:
        compliance_score = 0
    else:
        compliance_score = (matched / len(requirements)) * 100

    return {
        "compliance_score": round(compliance_score, 2),
        "matched": matched,
        "total": len(requirements),
        "matched_items": matched_items,
        "gaps": gaps,
        "gaps_found": len(gaps)
    }