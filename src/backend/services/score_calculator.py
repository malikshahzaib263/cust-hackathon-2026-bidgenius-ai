def calculate_tender_score(compliance_score, capability_score, evaluation_score, gaps_found):
    """
    Balanced tender score formula:
    - 45% compliance
    - 30% capability match
    - 25% evaluation fit
    - softer gap penalty
    """

    gap_penalty = min(gaps_found * 2, 15)

    final_score = (
        (0.45 * compliance_score)
        + (0.30 * capability_score)
        + (0.25 * evaluation_score)
        - gap_penalty
    )

    final_score = max(0, min(final_score, 100))

    return round(final_score, 2)