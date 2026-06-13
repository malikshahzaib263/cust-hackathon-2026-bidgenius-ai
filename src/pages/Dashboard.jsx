import { useNavigate } from "react-router-dom";
import {
  FileCheck2,
  TrendingUp,
  AlertTriangle,
  FolderKanban,
  UploadCloud,
  Brain,
  Search,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import WinProbabilityCard from "../components/dashboard/WinProbabilityCard";
import ComplianceScoreCard from "../components/dashboard/ComplianceScoreCard";
import DecisionCard from "../components/dashboard/DecisionCard";
import { dashboardStats, recentBids } from "../data/dummyData";

function getStoredResult() {
  try {
    return JSON.parse(localStorage.getItem("bidgenius_result"));
  } catch {
    return null;
  }
}

function buildDemoResult(bid) {
  return {
    filename: bid.title,
    sector: "IT Services",
    deadline: bid.date,
    win_probability: bid.score,
    decision: bid.status,
    tender_score: bid.score,
    doc_pages_estimated: 90,
    compliance: {
      compliance_score: bid.score,
      matched: bid.status === "GO" ? 4 : 2,
      total: 4,
      gaps_found: bid.status === "GO" ? 0 : 2,
      gaps:
        bid.status === "GO"
          ? []
          : ["Missing certification evidence", "Incomplete capability match"],
    },
    requirements: [
      "Technical proposal required",
      "Relevant project experience required",
      "Company profile required",
      "Compliance documents required",
    ],
    ner_fields: {
      client_name: "Demo Client",
      sector: "IT Services",
      deadline: bid.date,
      budget: "PKR 2.5M",
      submission_email: "Not found",
      experience_years: null,
      certifications: [],
    },
    rag_evidence: [],
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const result = getStoredResult();

  const winProbability = result?.win_probability ?? dashboardStats.winProbability;
  const complianceScore =
    result?.compliance?.compliance_score ?? dashboardStats.complianceScore;
  const missingGaps = result?.compliance?.gaps_found ?? dashboardStats.missingGaps;
  const decision = result?.decision ?? dashboardStats.decision;

  const dynamicBid = result
    ? {
        title: result.filename || "Uploaded RFP",
        status: decision,
        score: winProbability,
        date: "Latest Analysis",
        result,
      }
    : null;

  const bidList = dynamicBid ? [dynamicBid, ...recentBids] : recentBids;

  function openBid(bid) {
    const selectedResult = bid.result || buildDemoResult(bid);
    localStorage.setItem("bidgenius_result", JSON.stringify(selectedResult));
    navigate("/analysis");
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-cyan-300/25 bg-[#081827] p-8 md:p-12 shadow-[0_25px_100px_rgba(34,211,238,0.15)]">
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />

        <div className="relative grid lg:grid-cols-[1.25fr_0.75fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <Sparkles size={16} />
              AI-Powered Bid & Proposal Response Engine
            </div>

            <h1 className="mt-6 max-w-5xl text-5xl md:text-7xl font-black tracking-tight leading-[0.95]">
              From Tender Document to{" "}
              <span className="text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                Winning Proposal
              </span>{" "}
              in Minutes.
            </h1>

            <p className="text-slate-300 mt-6 max-w-3xl text-base md:text-lg leading-relaxed">
              Upload RFPs, extract mandatory requirements, match company
              capabilities with RAG, flag compliance gaps, predict win
              probability, and generate proposal drafts automatically.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/upload")}
                className="group inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-6 py-3 font-black text-[#06111f] hover:bg-cyan-200 transition shadow-[0_12px_40px_rgba(34,211,238,0.25)]"
              >
                Analyze New RFP
                <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => navigate("/analysis")}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-6 py-3 font-bold text-slate-200 hover:border-cyan-300/40 hover:bg-white/12 transition"
              >
                View Latest Analysis
              </button>
            </div>
          </div>

          <div className="relative perspective-[1000px]">
            <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl rotate-[-2deg] hover:rotate-0 transition duration-500">
              <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-cyan-300/30 via-transparent to-purple-500/30 opacity-60" />
              <div className="relative rounded-[1.5rem] bg-[#06111f]/90 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400">
                    Live Bid Intelligence
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      decision === "GO"
                        ? "bg-emerald-400/15 text-emerald-300"
                        : decision === "REVIEW"
                        ? "bg-amber-400/15 text-amber-300"
                        : "bg-red-400/15 text-red-300"
                    }`}
                  >
                    {decision}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <HeroMetric label="Win Chance" value={`${winProbability}%`} />
                  <HeroMetric label="Compliance" value={`${complianceScore}%`} />
                  <HeroMetric label="Gaps Found" value={missingGaps} />
                  <HeroMetric
                    label="Sector"
                    value={result?.sector || "Multi"}
                    small
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/8 p-4">
                  <p className="text-xs text-slate-400">Latest RFP</p>
                  <p className="mt-1 font-black text-white line-clamp-1">
                    {result?.filename || "Upload an RFP to begin"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Deadline: {result?.deadline || "Not detected yet"}
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <PipelineItem icon={<UploadCloud size={15} />} text="PDF Extracted" />
                  <PipelineItem icon={<Brain size={15} />} text="NER Fields Detected" />
                  <PipelineItem icon={<Search size={15} />} text="RAG Evidence Matched" />
                  <PipelineItem icon={<ShieldCheck size={15} />} text="Compliance Scored" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {result && (
        <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-white/6 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-cyan-200 font-bold">Latest Uploaded RFP</p>

              <h2 className="text-2xl font-black mt-2">
                {result.filename || "Uploaded Tender"}
              </h2>

              <p className="text-slate-400 mt-2">
                Sector:{" "}
                <span className="text-white font-bold">
                  {result.sector || "Unknown"}
                </span>{" "}
                • Deadline:{" "}
                <span className="text-white font-bold">
                  {result.deadline || "Not found"}
                </span>
              </p>
            </div>

            <button
              onClick={() => navigate("/analysis")}
              className="rounded-2xl bg-cyan-300 px-5 py-3 font-black text-[#06111f] hover:bg-cyan-200 transition"
            >
              Open Analysis
            </button>
          </div>
        </section>
      )}

      <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Bids"
          value={dashboardStats.totalBids}
          subtitle="Current workspace"
          icon={<FolderKanban />}
        />

        <StatCard
          title="Compliance"
          value={`${complianceScore}%`}
          subtitle="Requirement match"
          icon={<FileCheck2 />}
        />

        <StatCard
          title="Win Probability"
          value={`${winProbability}%`}
          subtitle="AI bid score"
          icon={<TrendingUp />}
        />

        <StatCard
          title="Missing Gaps"
          value={missingGaps}
          subtitle="Need review"
          icon={<AlertTriangle />}
        />
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <WinProbabilityCard value={winProbability} />
        <ComplianceScoreCard score={complianceScore} />
        <DecisionCard decision={decision} />
      </section>

      <section className="grid lg:grid-cols-[1fr_0.8fr] gap-6">
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-black">Recent Bid Workspaces</h2>
            <span className="text-xs text-cyan-200 font-bold">
              Click any workspace to open
            </span>
          </div>

          <div className="space-y-3">
            {bidList.map((bid, index) => (
              <button
                key={`${bid.title}-${index}`}
                onClick={() => openBid(bid)}
                className="group w-full flex items-center justify-between p-4 rounded-2xl bg-white/6 border border-white/10 hover:border-cyan-300/40 hover:bg-white/10 transition text-left"
              >
                <div>
                  <p className="font-bold group-hover:text-cyan-200 transition">
                    {bid.title}
                  </p>
                  <p className="text-xs text-slate-400">{bid.date}</p>
                </div>

                <div className="text-right">
                  <p className="font-black">{bid.score}%</p>
                  <p
                    className={`text-xs ${
                      bid.status === "GO"
                        ? "text-emerald-300"
                        : bid.status === "REVIEW"
                        ? "text-amber-300"
                        : "text-red-300"
                    }`}
                  >
                    {bid.status}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/8 p-6 shadow-[0_20px_70px_rgba(16,185,129,0.08)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-300/15 border border-emerald-300/25 p-3 text-emerald-300">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black">Demo Readiness</h2>
              <p className="text-xs text-slate-400">System modules active</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              "PDF Extraction",
              "NER Detection",
              "RAG Matching",
              "Compliance Gaps",
              "Random Forest Prediction",
              "Proposal PDF Export",
              "OpenRouter Tender Chat",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl bg-white/6 border border-white/10 p-3"
              >
                <CheckCircle2 size={16} className="text-emerald-300" />
                <span className="text-sm text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroMetric({ label, value, small }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <h3 className={`${small ? "text-lg" : "text-3xl"} font-black mt-2`}>
        {value}
      </h3>
    </div>
  );
}

function PipelineItem({ icon, text }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 p-3">
      <div className="text-cyan-300">{icon}</div>
      <span className="text-sm text-slate-300">{text}</span>
    </div>
  );
}