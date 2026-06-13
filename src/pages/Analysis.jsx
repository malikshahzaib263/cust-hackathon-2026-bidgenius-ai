import { useMemo } from "react";

export default function Analysis() {
  const result = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("bidgenius_result"));
      return stored?.payload || stored;
    } catch {
      return null;
    }
  }, []);

  if (!result) {
    return (
      <div className="glass rounded-3xl p-8">
        <h1 className="text-3xl font-black">No Analysis Found</h1>
        <p className="text-slate-400 mt-3">
          Please upload and analyze an RFP document first.
        </p>
      </div>
    );
  }

  const compliance = result.compliance || {};
  const ner = result.ner_fields || {};
  const ragEvidence = result.rag_evidence || result.ragEvidence || [];

  const winProbability = result.win_probability ?? result.stats?.winProbability ?? 0;
  const decision = result.decision ?? result.stats?.decision ?? "N/A";
  const complianceScore = compliance.compliance_score ?? result.stats?.complianceScore ?? 0;
  const gapsFound = compliance.gaps_found ?? result.stats?.missingGaps ?? 0;
  const matched = compliance.matched ?? 0;
  const total = compliance.total ?? result.requirements_count ?? 0;

  const improvement = buildGapClosurePlan(result, winProbability, complianceScore, gapsFound);

  return (
    <div className="space-y-8">
      <section>
        <p className="text-cyan-200 font-bold">AI Analysis</p>

        <h1 className="text-4xl font-black mt-2">
          Tender Compliance Dashboard
        </h1>

        <p className="text-slate-400 mt-3 max-w-3xl">
          This dashboard shows live results from your FastAPI backend using PDF
          extraction, NER, RAG capability matching, compliance scoring, and Random
          Forest win prediction.
        </p>
      </section>

      <section className="grid md:grid-cols-4 gap-5">
        <Info title="Win Probability" value={`${winProbability}%`} />
        <Info title="Decision" value={decision} highlight={decision} />
        <Info title="Compliance Score" value={`${complianceScore}%`} />
        <Info title="Tender Score" value={result.tender_score ?? "N/A"} />
      </section>

      <section className="grid md:grid-cols-3 gap-5">
        <Info title="File Name" value={result.filename || "N/A"} />
        <Info title="Sector" value={result.sector || ner.sector || "Unknown"} />
        <Info title="Deadline" value={result.deadline || ner.deadline || "Not found"} />
      </section>

      <section className="rounded-[2rem] p-6 md:p-7 bg-gradient-to-r from-cyan-300/15 via-blue-500/10 to-emerald-400/10 border border-cyan-300/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-cyan-200 font-bold">Gap Closure Advisor</p>
            <h2 className="text-3xl font-black mt-2">
              Improve Bid Strength Before Submission
            </h2>
            <p className="text-slate-300 mt-3 max-w-2xl">
              BidGenius AI estimates how much your win chance can improve if the
              bidder uploads missing compliance evidence and closes key gaps.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 min-w-[280px]">
            <ScoreBox label="Current Chance" value={`${winProbability}%`} tone="bad" />
            <ScoreBox label="Potential Chance" value={`${improvement.potentialWin}%`} tone="good" />
          </div>
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-4">
          <AdvisorCard
            title="Evidence Needed"
            items={improvement.evidenceNeeded}
            tone="cyan"
          />

          <AdvisorCard
            title="Action Plan"
            items={improvement.actionPlan}
            tone="green"
          />

          <AdvisorCard
            title="Why Score Is Low"
            items={improvement.reasons}
            tone="amber"
          />
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Current</span>
            <span>Potential after gap closure</span>
          </div>

          <div className="w-full h-5 bg-white/10 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-red-400/70 rounded-full"
              style={{ width: `${Math.min(winProbability, 100)}%` }}
            />
            <div
              className="h-full bg-cyan-300/80 rounded-full absolute top-0 left-0 opacity-60"
              style={{ width: `${Math.min(improvement.potentialWin, 100)}%` }}
            />
          </div>
        </div>
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="text-2xl font-black mb-5">NER Extracted Fields</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Mini label="Client Name" value={ner.client_name || "Unknown"} />
          <Mini label="Budget" value={ner.budget || "Not found"} />
          <Mini label="Submission Email" value={ner.submission_email || "Not found"} />
          <Mini label="Experience Years" value={ner.experience_years || "Not found"} />
          <Mini
            label="Certifications"
            value={
              ner.certifications?.length
                ? ner.certifications.join(", ")
                : "Not found"
            }
          />
          <Mini label="Document Pages" value={result.doc_pages_estimated || "N/A"} />
        </div>
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="text-2xl font-black mb-2">Compliance Summary</h2>
        <p className="text-slate-400 mb-5">
          Matched {matched} out of {total} extracted requirements. Gaps found:{" "}
          {gapsFound}.
        </p>

        <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-300 rounded-full"
            style={{ width: `${complianceScore}%` }}
          />
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-2xl font-black mb-5">
            Extracted Requirements
          </h2>

          <div className="space-y-3">
            {(result.requirements || []).map((req, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-white/8 border border-white/10"
              >
                <p className="text-sm text-slate-200">{req}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-2xl font-black mb-5">Compliance Gaps</h2>

          <div className="space-y-3">
            {(compliance.gaps || []).length === 0 ? (
              <p className="text-green-300 font-bold">No major gaps found.</p>
            ) : (
              compliance.gaps.map((gap, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-red-400/10 border border-red-400/20"
                >
                  <p className="text-sm text-red-100">{gap}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="text-2xl font-black mb-5">RAG Evidence Matches</h2>

        <div className="space-y-5">
          {ragEvidence.slice(0, 8).map((item, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-white/8 border border-white/10"
            >
              <p className="font-bold text-cyan-200 mb-3">
                Requirement: {item.requirement}
              </p>

              <div className="grid md:grid-cols-3 gap-3">
                {(item.matches || []).map((match, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-4 bg-[#06111f] border border-white/10"
                  >
                    <p className="font-bold text-sm">
                      {match.domain || "Matched Domain"}
                    </p>

                    <p className="text-xs text-slate-400 mt-2">
                      {match.project_summary ||
                        match.project ||
                        "Evidence found"}
                    </p>

                    <p className="text-xs text-cyan-300 mt-2">
                      Similarity: {match.similarity ?? match.score ?? "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function buildGapClosurePlan(result, winProbability, complianceScore, gapsFound) {
  const gaps = result.compliance?.gaps || [];
  const requirements = result.requirements || [];
  const text = `${gaps.join(" ")} ${requirements.join(" ")}`.toLowerCase();

  const evidenceNeeded = [];

  if (text.includes("ifrs") || text.includes("taxonomy") || text.includes("xbrl")) {
    evidenceNeeded.push("Upload IFRS / XBRL taxonomy project evidence");
    evidenceNeeded.push("Add financial reporting or taxonomy consultancy case study");
  }

  if (text.includes("pec")) {
    evidenceNeeded.push("Upload PEC registration or relevant engineering certification");
  }

  if (text.includes("ntn") || text.includes("gst") || text.includes("tax")) {
    evidenceNeeded.push("Upload NTN, GST, and tax registration documents");
  }

  if (text.includes("experience") || text.includes("similar")) {
    evidenceNeeded.push("Upload similar project completion certificates");
  }

  if (text.includes("technical proposal")) {
    evidenceNeeded.push("Attach technical methodology and implementation approach");
  }

  if (text.includes("financial proposal")) {
    evidenceNeeded.push("Attach financial proposal and BOQ/cost breakdown");
  }

  if (evidenceNeeded.length === 0) {
    evidenceNeeded.push("Upload relevant past project evidence");
    evidenceNeeded.push("Attach certifications and company registration documents");
    evidenceNeeded.push("Add team CVs and client references");
  }

  const actionPlan = [
    "Review all red compliance gaps before submission",
    "Upload missing certificates and project evidence",
    "Map each requirement to at least one capability record",
    "Re-run analysis to refresh win probability",
  ];

  const reasons = [
    `Current compliance is ${complianceScore}%`,
    `${gapsFound} gaps are still unresolved`,
    "Capability evidence does not fully match extracted requirements",
    "NO-GO can move to REVIEW/GO after evidence completion",
  ];

  const potentialWin = Math.min(
    92,
    Math.round(Number(winProbability || 0) + Math.min(45, gapsFound * 7) + 12)
  );

  return {
    potentialWin,
    evidenceNeeded: evidenceNeeded.slice(0, 5),
    actionPlan,
    reasons,
  };
}

function Info({ title, value, highlight }) {
  const isGo = highlight === "GO";
  const isReview = highlight === "REVIEW";
  const isNoGo = highlight === "NO-GO";

  return (
    <div className="glass rounded-3xl p-6">
      <p className="text-sm text-slate-400">{title}</p>

      <h3
        className={`text-2xl font-black mt-3 ${
          isGo
            ? "text-green-300"
            : isReview
            ? "text-yellow-300"
            : isNoGo
            ? "text-red-300"
            : ""
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-2xl p-4 bg-white/8 border border-white/10">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-bold mt-2 text-sm wrap-break-word">{value}</p>
    </div>
  );
}

function ScoreBox({ label, value, tone }) {
  const color =
    tone === "good"
      ? "text-emerald-300 border-emerald-300/30 bg-emerald-400/10"
      : "text-red-300 border-red-300/30 bg-red-400/10";

  return (
    <div className={`rounded-3xl p-5 border ${color}`}>
      <p className="text-xs text-slate-300">{label}</p>
      <h3 className="text-4xl font-black mt-2">{value}</h3>
    </div>
  );
}

function AdvisorCard({ title, items, tone }) {
  const border =
    tone === "green"
      ? "border-emerald-300/20"
      : tone === "amber"
      ? "border-amber-300/20"
      : "border-cyan-300/20";

  return (
    <div className={`rounded-3xl p-5 bg-white/8 border ${border}`}>
      <h3 className="font-black text-lg mb-4">{title}</h3>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 text-sm text-slate-300">
            <span className="text-cyan-300 font-black">0{index + 1}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}