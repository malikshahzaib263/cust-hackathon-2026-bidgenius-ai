export default function ComplianceScoreCard({ score = 82 }) {
  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="text-xl font-black">Compliance Score</h3>
      <p className="text-sm text-slate-400 mt-1">Mandatory requirements matched</p>

      <div className="mt-8">
        <div className="flex justify-between text-sm mb-2">
          <span>Matched</span>
          <span>{score}%</span>
        </div>
        <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-300 rounded-full" style={{ width: `${score}%` }} />
        </div>
      </div>

      <p className="text-sm text-slate-400 mt-6">
        Strong fit, but missing certifications must be reviewed before final submission.
      </p>
    </div>
  );
}
