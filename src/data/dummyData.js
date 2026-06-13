export const dashboardStats = {
  totalBids: 12,
  complianceScore: 82,
  winProbability: 78,
  missingGaps: 3,
  decision: "GO",
};

export const recentBids = [
  { title: "IT Services RFP", status: "GO", score: 78, date: "10 Jun 2026" },
  { title: "Cloud Migration Tender", status: "Review", score: 64, date: "09 Jun 2026" },
  { title: "Cybersecurity RFQ", status: "NO-GO", score: 48, date: "08 Jun 2026" },
];

export const requirements = [
  {
    id: 1,
    requirement: "Minimum 3 years relevant experience in IT projects",
    evidence: "AI Speech-to-Text Predictor and ERP projects found",
    status: "Pass",
    gap: "No gap",
  },
  {
    id: 2,
    requirement: "Technical proposal with implementation methodology",
    evidence: "AI-generated draft available",
    status: "Pass",
    gap: "Needs final human review",
  },
  {
    id: 3,
    requirement: "ISO 27001 certification required",
    evidence: "Not found in capability library",
    status: "Fail",
    gap: "Upload certificate or mark as unavailable",
  },
  {
    id: 4,
    requirement: "CVs of technical team members",
    evidence: "3 team profiles found",
    status: "Pass",
    gap: "Add signatures if required",
  },
  {
    id: 5,
    requirement: "Project delivery timeline",
    evidence: "Timeline template matched",
    status: "Pass",
    gap: "Customize dates",
  },
];

export const evaluationCriteria = [
  { name: "Technical Experience", weight: 35, score: 88 },
  { name: "Methodology", weight: 25, score: 81 },
  { name: "Financial Fit", weight: 20, score: 72 },
  { name: "Certifications", weight: 10, score: 45 },
  { name: "Team Strength", weight: 10, score: 84 },
];

export const proposalSections = [
  {
    title: "Executive Summary",
    body:
      "BidGenius AI has prepared a concise executive summary aligned with the tender objectives, emphasizing relevant experience, delivery capability, and measurable outcomes.",
  },
  {
    title: "Technical Approach",
    body:
      "The proposed approach includes requirement analysis, solution architecture, agile delivery, quality assurance, deployment, and post-delivery support.",
  },
  {
    title: "Relevant Experience",
    body:
      "The capability library matched previous AI, ERP, and web application projects that demonstrate the team's ability to deliver similar work.",
  },
  {
    title: "Project Timeline",
    body:
      "A phased delivery plan is recommended: discovery, design, development, testing, deployment, and handover.",
  },
  {
    title: "Risk Management",
    body:
      "Key risks include unclear requirements, missing compliance documents, and timeline delays. Mitigation steps are included for each risk.",
  },
];

export const chatMessages = [
  {
    role: "assistant",
    text: "Hello! Ask me anything about this tender, compliance gaps, deadlines, or proposal sections.",
  },
];
