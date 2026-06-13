export default function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="glass rounded-3xl p-6 hover:-translate-y-1 transition duration-300">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <div className="text-cyan-300">{icon}</div>
      </div>
      <h2 className="text-4xl font-black mt-4">{value}</h2>
      <p className="text-sm text-slate-400 mt-2">{subtitle}</p>
    </div>
  );
}
