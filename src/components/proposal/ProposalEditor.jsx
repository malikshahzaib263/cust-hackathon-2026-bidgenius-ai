import { useEffect, useState } from "react";
import { useTenderContext } from "../../context/TenderContext";
import { Loader2, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";

function getStoredResult() {
  try {
    return JSON.parse(localStorage.getItem("bidgenius_result")) || {};
  } catch {
    return {};
  }
}

function generateProposalFromAnalysis(result) {
  const requirements = result.requirements || [];
  const gaps = result.compliance?.gaps || [];
  const ragEvidence = result.rag_evidence || [];
  const decision = result.decision || "N/A";
  const winProbability = result.win_probability ?? "N/A";
  const complianceScore = result.compliance?.compliance_score ?? "N/A";
  const sector = result.sector || "identified";
  const deadline = result.deadline || "as specified in the RFP";

  const topEvidence =
    ragEvidence
      .flatMap((item) => item.matches || [])
      .filter((m) => m?.domain || m?.project_summary)
      .slice(0, 4)
      .map((m) => `${m.domain}: ${m.project_summary}`)
      .join(" ") ||
    "Relevant capability evidence should be reviewed from the company capability library before final submission.";

  const topRequirements =
    requirements.slice(0, 4).join("; ") ||
    "mandatory technical, financial, eligibility, and submission requirements";

  const gapText =
    gaps.length > 0
      ? gaps.slice(0, 4).join("; ")
      : "No major compliance gaps were detected by the system.";

  return [
    {
      title: "Executive Summary",
      body: `This proposal response is prepared for ${result.filename || "the uploaded RFP"} in the ${sector} sector. The system analysis produced a ${winProbability}% win probability with a ${decision} recommendation and a ${complianceScore}% compliance score. The response focuses on meeting the tender requirements while clearly addressing identified capability and compliance gaps before final submission.`,
    },
    {
      title: "Technical Approach",
      body: `Our technical approach is aligned with the extracted requirements: ${topRequirements}. The delivery plan will include requirement validation, methodology preparation, evidence mapping, compliance review, risk handling, and final proposal packaging. Each response section will be mapped against the RFP requirements to reduce disqualification risk.`,
    },
    {
      title: "Relevant Experience",
      body: `The RAG capability search retrieved relevant evidence from the company capability library. ${topEvidence} These records can be used to strengthen the proposal narrative and demonstrate organizational capability against the tender requirements.`,
    },
    {
      title: "Compliance & Gap Response",
      body: `The compliance engine found ${gaps.length} gap(s) and calculated a ${complianceScore}% compliance score. Key gaps requiring attention include: ${gapText}. These items should be reviewed, supported with evidence where available, or clearly addressed before submission.`,
    },
    {
      title: "Project Timeline",
      body: `The proposal preparation timeline should prioritize requirement validation, technical narrative drafting, financial response preparation, compliance review, and final approval before the deadline: ${deadline}. This phased approach ensures that the bid team can complete the submission with sufficient review time.`,
    },
    {
      title: "Risk Management",
      body: `The primary risks include missing evidence, weak capability alignment, incomplete compliance documents, and late submission. These risks will be managed through early gap review, RAG-based evidence matching, internal approval checkpoints, and a final compliance checklist before submission.`,
    },
  ];
}

export default function ProposalEditor() {
  const { proposal, setProposal } = useTenderContext();
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [loadingAll, setLoadingAll] = useState(false);
  const [savedIndex, setSavedIndex] = useState(null);

  useEffect(() => {
    const result = getStoredResult();

    if (result?.filename) {
      const generated = generateProposalFromAnalysis(result);
      setProposal(generated);
    }
  }, [setProposal]);

  function updateBody(index, body) {
    const next = [...proposal];
    next[index] = { ...next[index], body };
    setProposal(next);
  }

  function regenerateSection(index) {
    setLoadingIndex(index);

    const result = getStoredResult();
    const generated = generateProposalFromAnalysis(result);
    const sectionTitle = proposal[index].title;

    const matchedSection =
      generated.find((item) => item.title === sectionTitle) || generated[index];

    if (matchedSection) {
      updateBody(index, matchedSection.body);
    }

    setSavedIndex(index);
    setTimeout(() => setSavedIndex(null), 2000);
    setLoadingIndex(null);
  }

  function regenerateAll() {
    setLoadingAll(true);

    const result = getStoredResult();
    const generated = generateProposalFromAnalysis(result);

    setProposal(generated);

    setTimeout(() => {
      setLoadingAll(false);
    }, 600);
  }

  return (
    <div className="glass rounded-3xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Edit Proposal Sections</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sections are generated from uploaded RFP analysis, NER fields, RAG
            evidence, compliance gaps, and win probability.
          </p>
        </div>

        <button
          onClick={regenerateAll}
          disabled={loadingAll}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-300 hover:bg-cyan-200
            text-[#06111f] font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingAll ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate from Analysis
            </>
          )}
        </button>
      </div>

      {loadingAll && (
        <div className="rounded-2xl bg-cyan-300/10 border border-cyan-300/20 px-5 py-4 text-sm text-cyan-200 flex items-center gap-3">
          <Loader2 size={16} className="animate-spin shrink-0" />
          BidGenius AI is generating proposal sections from RFP analysis.
        </div>
      )}

      <div className="space-y-5">
        {proposal.map((section, index) => (
          <div
            key={`${section.title}-${index}`}
            className="rounded-2xl bg-white/4 border border-white/8 p-4"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <label className="text-sm font-bold text-cyan-200">
                {section.title}
              </label>

              <button
                onClick={() => regenerateSection(index)}
                disabled={loadingIndex !== null || loadingAll}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl
                  bg-white/8 border border-white/10 text-slate-300 hover:border-cyan-300/40
                  hover:text-cyan-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loadingIndex === index ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : savedIndex === index ? (
                  <CheckCircle2 size={12} className="text-emerald-400" />
                ) : (
                  <RefreshCw size={12} />
                )}

                {loadingIndex === index
                  ? "Writing…"
                  : savedIndex === index
                  ? "Updated!"
                  : "Regenerate"}
              </button>
            </div>

            <textarea
              value={section.body}
              onChange={(e) => updateBody(index, e.target.value)}
              rows={5}
              className="w-full rounded-xl bg-white/6 border border-white/10 outline-none px-4 py-3
                text-slate-200 text-sm focus:border-cyan-300 resize-y transition leading-relaxed"
            />

            <p className="text-right text-xs text-slate-600 mt-1">
              {section.body.length} chars
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}