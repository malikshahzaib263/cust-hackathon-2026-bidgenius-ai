import { requirements } from "../../data/dummyData";

export default function RequirementTable() {
  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="text-2xl font-black mb-5">Extracted Requirements</h2>
      <div className="space-y-3">
        {requirements.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl bg-white/6 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <p className="font-bold">{item.requirement}</p>
              <span className={`px-3 py-1 rounded-full text-xs font-black w-fit ${item.status === "Pass" ? "badge-go" : "badge-fail"}`}>
                {item.status}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-2">Evidence: {item.evidence}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
