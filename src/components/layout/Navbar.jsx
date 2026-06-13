import { Menu, Search, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#06111f]/75 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="lg:hidden flex items-center gap-3">
          <Menu />
          <span className="font-black">BidGenius AI</span>
        </div>

        <div className="hidden md:flex items-center gap-3 bg-white/8 border border-white/10 rounded-2xl px-4 py-3 w-96">
          <Search size={18} className="text-slate-400" />
          <input
            className="bg-transparent outline-none w-full text-sm placeholder:text-slate-500"
            placeholder="Search bids, requirements, gaps..."
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-2xl glass flex items-center justify-center">
            <Bell size={18} />
          </button>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">Hackathon Team</p>
            <p className="text-xs text-slate-400">Problem 1</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-cyan-300 text-[#06111f] flex items-center justify-center font-black">
            BG
          </div>
        </div>
      </div>
    </header>
  );
}
