import { useMemo } from "react";
import { useTenderContext } from "../../context/TenderContext";
import { FileText, CheckCircle2, XCircle } from "lucide-react";

const SECTION_ICONS = {
  "Executive Summary": "📋",
  "Technical Approach": "⚙️",
  "Relevant Experience": "🏆",
  "Project Timeline": "📅",
  "Risk Management": "🛡️",
};

function getStoredResult() {
  try {
    return JSON.parse(localStorage.getItem("bidgenius_result")) || {};
  } catch {
    return {};
  }
}

export default function ProposalPreview() {
  const { proposal } = useTenderContext();
  const result = useMemo(() => getStoredResult(), []);

  const complianceScore = result.compliance?.compliance_score ?? "N/A";
  const winProbability = result.win_probability ?? "N/A";
  const decision = result.decision || "N/A";
  const gapsFound = result.compliance?.gaps_found ?? 0;

  return (
    <div className="glass rounded-3xl p-6 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-300/20 border border-cyan-300/30 flex items-center justify-center">
          <FileText size={18} className="text-cyan-300" />
        </div>
        <div>
          <h2 className="text-2xl font-black">Proposal Preview</h2>
          <p className="text-xs text-slate-400">
            {proposal.length} sections • Dynamic AI draft
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-linear-to-r from-cyan-300/10 to-blue-500/8 border border-cyan-300/20 p-4">
        <p className="text-xs font-bold text-cyan-200 mb-2">Proposal Metadata</p>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
          <span>
            Tender:{" "}
            <span className="text-white font-bold">
              {result.filename || "Uploaded RFP"}
            </span>
          </span>

          <span>
            Sector:{" "}
            <span className="text-white font-bold">
              {result.sector || "Not detected"}
            </span>
          </span>

          <span>
            Deadline:{" "}
            <span className="text-white font-bold">
              {result.deadline || "Not found"}
            </span>
          </span>

          <span>
            Decision:{" "}
            <span className="text-white font-bold">
              {decision}
            </span>
          </span>

          <span>
            Win Probability:{" "}
            <span className="text-white font-bold">
              {winProbability}%
            </span>
          </span>

          <span>
            Compliance:{" "}
            <span className="text-white font-bold">
              {complianceScore}%
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <CheckCircle2 size={14} />
          <span>{winProbability}% win probability</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-400">
          <XCircle size={14} />
          <span>{gapsFound} compliance gaps found</span>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto" style={{ maxHeight: "60vh" }}>
        {proposal.map((section, i) => (
          <article
            key={section.title}
            className="p-5 rounded-2xl bg-[#06111f]/60 border border-white/10 hover:border-cyan-300/20 transition"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">
                {SECTION_ICONS[section.title] || "📄"}
              </span>

              <h3 className="text-cyan-300 font-black text-base">
                {section.title}
              </h3>

              <span className="ml-auto text-xs text-slate-600 font-mono">
                §{i + 1}
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed text-sm">
              {section.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}