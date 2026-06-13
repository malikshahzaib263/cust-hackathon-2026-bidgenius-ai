export default function ChatMessage({ role, text }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xl rounded-3xl px-5 py-4 ${isUser ? "bg-cyan-300 text-[#06111f]" : "bg-white/10 text-slate-200 border border-white/10"}`}>
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
