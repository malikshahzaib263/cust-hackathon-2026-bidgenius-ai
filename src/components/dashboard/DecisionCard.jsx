export default function DecisionCard({ decision = "GO", reason = "High compliance and strong capability match." }) {
  const isGo = decision === "GO";

  return (
    <div className={`rounded-3xl p-6 border ${isGo ? "bg-green-400/10 border-green-400/30" : "bg-red-400/10 border-red-400/30"}`}>
      <p className="text-sm text-slate-300">Recommended Decision</p>
      <h3 className={`text-5xl font-black mt-4 ${isGo ? "text-green-300" : "text-red-300"}`}>{decision}</h3>
      <p className="text-sm text-slate-400 mt-4">{reason}</p>
    </div>
  );
}
