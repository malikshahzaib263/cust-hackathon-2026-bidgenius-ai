import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function WinProbabilityCard({ value = 78 }) {
  const data = [
    { name: "Win", value },
    { name: "Remaining", value: 100 - value },
  ];

  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="text-xl font-black">Win Probability</h3>
      <p className="text-sm text-slate-400 mt-1">AI scoring based on bid fit</p>

      <div className="h-52 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={65} outerRadius={85} paddingAngle={4} dataKey="value">
              <Cell fill="#22d3ee" />
              <Cell fill="rgba(255,255,255,0.12)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-black">{value}%</span>
        </div>
      </div>
    </div>
  );
}
