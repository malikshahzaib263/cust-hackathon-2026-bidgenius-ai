import {
  CheckCircle2,
  Server,
  Brain,
  FileText,
  Search,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Database,
} from "lucide-react";

const modules = [
  {
    title: "PDF Text Extraction",
    detail: "RFP documents are parsed using backend PDF extraction.",
    icon: <FileText size={18} />,
  },
  {
    title: "NER Extraction",
    detail: "Client, deadline, budget, email, certifications and sector are extracted.",
    icon: <Brain size={18} />,
  },
  {
    title: "RAG Capability Matching",
    detail: "Extracted requirements are matched with the capability library.",
    icon: <Search size={18} />,
  },
  {
    title: "Compliance Scoring",
    detail: "Matched requirements and missing gaps are calculated dynamically.",
    icon: <ShieldCheck size={18} />,
  },
  {
    title: "Random Forest Win Prediction",
    detail: "Historical bid model predicts win probability and GO/NO-GO decision.",
    icon: <TrendingUp size={18} />,
  },
  {
    title: "Proposal Generator",
    detail: "Proposal sections are generated from analysis, gaps and RAG evidence.",
    icon: <Sparkles size={18} />,
  },
  {
    title: "Tender Chat",
    detail: "OpenRouter AI answers questions using the latest uploaded RFP context.",
    icon: <MessageSquare size={18} />,
  },
  {
    title: "Capability Dataset",
    detail: "Backend Excel capability library is used as evidence source.",
    icon: <Database size={18} />,
  },
];

export default function Settings() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-cyan-200 font-bold">Configuration</p>
        <h1 className="text-4xl font-black mt-2">Settings</h1>
        <p className="text-slate-400 mt-3 max-w-2xl">
          System status for BidGenius AI modules used in RFP analysis, RAG
          matching, compliance scoring, proposal generation, and tender chat.
        </p>
      </section>

      <section className="grid lg:grid-cols-3 gap-5">
        <StatusCard
          title="Backend API"
          value="Online"
          subtitle="FastAPI service running locally"
          icon={<Server size={20} />}
          tone="green"
        />

        <StatusCard
          title="AI Provider"
          value="OpenRouter"
          subtitle="Used for tender chat and proposal assistance"
          icon={<Brain size={20} />}
          tone="cyan"
        />

        <StatusCard
          title="Model Mode"
          value="Context-Aware"
          subtitle="Uses latest uploaded RFP analysis"
          icon={<Sparkles size={20} />}
          tone="purple"
        />
      </section>

      <section className="glass rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-300/15 border border-cyan-300/25 flex items-center justify-center">
            <CheckCircle2 size={18} className="text-cyan-300" />
          </div>

          <div>
            <h2 className="text-2xl font-black">Active System Modules</h2>
            <p className="text-xs text-slate-400">
              These modules are enabled in the current hackathon build.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {modules.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl p-5 bg-white/6 border border-white/10 hover:border-cyan-300/30 transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-300/10 border border-cyan-300/20 flex items-center justify-center text-cyan-300 shrink-0">
                  {item.icon}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black">{item.title}</h3>
                    <CheckCircle2 size={14} className="text-emerald-300" />
                  </div>

                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

   
    </div>
  );
}

function StatusCard({ title, value, subtitle, icon, tone }) {
  const toneClass =
    tone === "green"
      ? "text-emerald-300 border-emerald-300/25 bg-emerald-400/10"
      : tone === "purple"
      ? "text-purple-300 border-purple-300/25 bg-purple-400/10"
      : "text-cyan-300 border-cyan-300/25 bg-cyan-400/10";

  return (
    <div className="glass rounded-3xl p-6">
      <div
        className={`w-11 h-11 rounded-xl border flex items-center justify-center ${toneClass}`}
      >
        {icon}
      </div>

      <p className="text-sm text-slate-400 mt-5">{title}</p>
      <h3 className="text-2xl font-black mt-2">{value}</h3>
      <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
    </div>
  );
}