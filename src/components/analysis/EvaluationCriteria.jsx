import { evaluationCriteria } from "../../data/dummyData";

export default function EvaluationCriteria() {
  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="text-2xl font-black mb-5">Evaluation Criteria</h2>
      <div className="space-y-4">
        {evaluationCriteria.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between text-sm mb-2">
              <span>{item.name}</span>
              <span className="text-slate-400">Weight {item.weight}% • Score {item.score}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-cyan-300 rounded-full" style={{ width: `${item.score}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
