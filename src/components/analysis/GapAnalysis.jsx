import { requirements } from "../../data/dummyData";

export default function GapAnalysis() {
  const gaps = requirements.filter((item) => item.status !== "Pass" || item.gap !== "No gap");

  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="text-2xl font-black mb-5">Gap Analysis</h2>
      <div className="space-y-3">
        {gaps.map((gap) => (
          <div key={gap.id} className="p-4 rounded-2xl bg-amber-300/8 border border-amber-300/20">
            <p className="font-bold text-amber-100">{gap.requirement}</p>
            <p className="text-sm text-slate-400 mt-1">{gap.gap}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
