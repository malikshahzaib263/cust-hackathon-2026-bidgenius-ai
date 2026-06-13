function getApiKey() {
  return (
    import.meta.env.VITE_OPENROUTER_API_KEY ||
    localStorage.getItem("bidgenius_openrouter_key") ||
    ""
  );
}

function getTenderResult() {
  try {
    return JSON.parse(localStorage.getItem("bidgenius_result")) || {};
  } catch {
    return {};
  }
}

function buildTenderSystemContext() {
  const result = getTenderResult();

  const requirements = result.requirements || [];
  const gaps = result.compliance?.gaps || [];
  const ragEvidence = result.rag_evidence || [];
  const ner = result.ner_fields || {};

  const reqList =
    requirements.length > 0
      ? requirements.map((r, i) => `${i + 1}. ${r}`).join("\n")
      : "No extracted requirements available.";

  const gapList =
    gaps.length > 0
      ? gaps.map((g, i) => `${i + 1}. ${g}`).join("\n")
      : "No major compliance gaps found.";

  const evidenceList =
    ragEvidence.length > 0
      ? ragEvidence
          .slice(0, 8)
          .map((item, i) => {
            const matches = (item.matches || [])
              .slice(0, 2)
              .map(
                (m) =>
                  `- ${m.domain || "Domain"}: ${
                    m.project_summary || m.project || "Evidence found"
                  }`
              )
              .join("\n");

            return `Requirement ${i + 1}: ${item.requirement}\n${matches}`;
          })
          .join("\n\n")
      : "No RAG evidence available.";

  return `You are BidGenius AI, an expert bid and proposal assistant.

Use ONLY the tender analysis context below. Do not invent facts. If evidence is missing, clearly say evidence is needed.

CURRENT TENDER ANALYSIS:
- File Name: ${result.filename || "Unknown"}
- Sector: ${result.sector || ner.sector || "Unknown"}
- Client: ${ner.client_name || "Unknown"}
- Deadline: ${result.deadline || ner.deadline || "Not found"}
- Budget: ${ner.budget || "Not found"}
- Submission Email: ${ner.submission_email || "Not found"}
- Certifications Detected: ${
    ner.certifications?.length ? ner.certifications.join(", ") : "None detected"
  }
- Win Probability: ${result.win_probability ?? "N/A"}%
- Compliance Score: ${result.compliance?.compliance_score ?? "N/A"}%
- Tender Score: ${result.tender_score ?? "N/A"}
- Missing Gaps: ${result.compliance?.gaps_found ?? "N/A"}
- Overall Decision: ${result.decision || "N/A"}

EXTRACTED REQUIREMENTS:
${reqList}

COMPLIANCE GAPS:
${gapList}

RAG EVIDENCE MATCHES:
${evidenceList}

Answer clearly, professionally, and practically. For gap-related questions, tell the bidder what document/evidence should be uploaded to improve win probability.`;
}

const MODEL = "deepseek/deepseek-chat-v3-0324";

async function callOpenRouter(messages, maxTokens = 1024) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "BidGenius AI",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("OpenRouter error:", data);
    throw new Error(data?.error?.message || "OpenRouter API failed");
  }

  return data.choices?.[0]?.message?.content || "No response generated.";
}

export async function chatWithTender(conversationHistory) {
  const messages = [
    {
      role: "system",
      content: buildTenderSystemContext(),
    },
    ...conversationHistory.map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.text,
    })),
  ];

  return await callOpenRouter(messages, 1024);
}

export async function regenerateProposalSection(sectionTitle, context = "") {
  const result = getTenderResult();

  const prompt = `Write a professional "${sectionTitle}" proposal section based on this tender analysis.

Tender:
- File: ${result.filename || "Uploaded RFP"}
- Sector: ${result.sector || "Unknown"}
- Deadline: ${result.deadline || "Not found"}
- Win Probability: ${result.win_probability ?? "N/A"}%
- Decision: ${result.decision || "N/A"}
- Compliance Score: ${result.compliance?.compliance_score ?? "N/A"}%

Requirements:
${(result.requirements || []).slice(0, 8).join("\n")}

Compliance Gaps:
${(result.compliance?.gaps || []).slice(0, 8).join("\n")}

${context ? `Additional context: ${context}` : ""}

Write 2-4 professional sentences. Do not include the section title. Do not invent certifications or evidence.`;

  return await callOpenRouter([{ role: "user", content: prompt }], 700);
}

export async function regenerateAllProposalSections() {
  const result = getTenderResult();

  const prompt = `You are a professional bid proposal writer.

Generate proposal sections based only on this tender analysis.

Tender:
- File: ${result.filename || "Uploaded RFP"}
- Sector: ${result.sector || "Unknown"}
- Deadline: ${result.deadline || "Not found"}
- Win Probability: ${result.win_probability ?? "N/A"}%
- Decision: ${result.decision || "N/A"}
- Compliance Score: ${result.compliance?.compliance_score ?? "N/A"}%

Requirements:
${(result.requirements || []).slice(0, 10).join("\n")}

Compliance Gaps:
${(result.compliance?.gaps || []).slice(0, 10).join("\n")}

Return ONLY valid JSON:
{
  "sections": [
    {"title": "Executive Summary", "body": "Content here"},
    {"title": "Technical Approach", "body": "Content here"},
    {"title": "Relevant Experience", "body": "Content here"},
    {"title": "Compliance & Gap Response", "body": "Content here"},
    {"title": "Project Timeline", "body": "Content here"},
    {"title": "Risk Management", "body": "Content here"}
  ]
}`;

  const text = await callOpenRouter([{ role: "user", content: prompt }], 1800);

  const cleanText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const parsed = JSON.parse(cleanText);
  return parsed.sections;
}

export async function testConnection() {
  return await callOpenRouter(
    [
      {
        role: "user",
        content: "Reply with exactly: BidGenius AI connected.",
      },
    ],
    30
  );
}