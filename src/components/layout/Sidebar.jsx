import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  FileCheck2,
  FileText,
  MessageSquareText,
  Settings,
  Sparkles,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload Tender", icon: Upload },
  { to: "/analysis", label: "Analysis", icon: FileCheck2 },
  { to: "/proposal", label: "Proposal", icon: FileText },
  { to: "/chat", label: "Tender Chat", icon: MessageSquareText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-72 min-h-screen p-5 border-r border-white/10 bg-[#071426]/80 backdrop-blur-xl sticky top-0">
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-cyan-300 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="text-[#06111f]" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">BidGenius AI</h1>
            <p className="text-xs text-slate-400">Proposal Response Engine</p>
          </div>
        </div>

        <nav className="space-y-2">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                    isActive
                      ? "bg-cyan-300 text-[#06111f] font-bold"
                      : "text-slate-300 hover:bg-white/10"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl p-5 bg-gradient-to-br from-cyan-300/15 to-blue-500/10 border border-cyan-300/20">
          <p className="text-sm font-bold text-cyan-200">Hackathon Goal</p>
          <p className="text-xs text-slate-400 mt-2">
            Reduce manual bid preparation effort by 50% with AI extraction, RAG matching, and proposal drafting.
          </p>
        </div>
      </div>
    </aside>
  );
}
