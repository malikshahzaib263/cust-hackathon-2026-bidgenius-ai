import { requirements } from "../../data/dummyData";

export default function ComplianceTable() {
  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="text-2xl font-black mb-5">Compliance Checklist</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-3">Requirement</th>
              <th className="pb-3">Evidence Found</th>
              <th className="pb-3">Gap</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((item) => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="py-4 pr-4 font-semibold">{item.requirement}</td>
                <td className="py-4 pr-4 text-slate-300">{item.evidence}</td>
                <td className="py-4 pr-4 text-slate-400">{item.gap}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${item.status === "Pass" ? "badge-go" : "badge-fail"}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
