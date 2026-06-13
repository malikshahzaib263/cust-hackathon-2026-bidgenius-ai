import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, Zap } from "lucide-react";
import { chatMessages } from "../../data/dummyData";
import { chatWithTender } from "../../services/geminiService";

const QUICK_QUESTIONS = [
  "What compliance gaps exist?",
  "What is our win probability?",
  "What documents are missing?",
  "Summarize the evaluation criteria",
  "What is the submission deadline?",
  "Should we bid on this tender?",
];

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-cyan-300/20 border border-cyan-300/30 flex items-center justify-center flex-shrink-0">
        <Sparkles size={16} className="text-cyan-300" />
      </div>
      <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tl-none px-5 py-4">
        <div className="flex gap-1.5 items-center h-5">
          <span className="w-2 h-2 rounded-full bg-cyan-300 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-cyan-300 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-cyan-300 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black
          ${isUser
            ? "bg-cyan-300 text-[#06111f]"
            : "bg-cyan-300/20 border border-cyan-300/30 text-cyan-300"
          }`}
      >
        {isUser ? "You" : <Sparkles size={16} />}
      </div>
      <div
        className={`max-w-[78%] rounded-2xl px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap
          ${isUser
            ? "bg-cyan-300/15 border border-cyan-300/20 text-white rounded-tr-none"
            : "bg-white/8 border border-white/10 text-slate-200 rounded-tl-none"
          }`}
      >
        {text}
      </div>
    </div>
  );
}

function NoApiKeyBanner() {
  return (
    <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 flex gap-4 items-start">
      <Zap size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-bold text-amber-300 text-sm">AI Not Connected</p>
        <p className="text-xs text-slate-400 mt-1">
          Go to <strong className="text-slate-300">Settings</strong> to add your Gemini API key, or add{" "}
          <code className="text-cyan-300">VITE_GEMINI_API_KEY</code> to your <code>.env</code> file.
        </p>
      </div>
    </div>
  );
}

export default function TenderChat() {
  const [messages, setMessages] = useState(chatMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [noKey, setNoKey] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(text = input) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage = { role: "user", text: trimmed };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setIsTyping(true);
    setNoKey(false);

    try {
      const response = await chatWithTender(newHistory);
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
    } catch (err) {
      if (err.message === "NO_API_KEY") {
        setNoKey(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "⚠️ No Gemini API key found. Please add your key in Settings to enable AI responses.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `❌ Error: ${err.message}. Please check your API key in Settings.`,
          },
        ]);
      }
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="glass rounded-3xl overflow-hidden flex flex-col" style={{ minHeight: "75vh" }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-300/20 border border-cyan-300/30 flex items-center justify-center">
            <Sparkles size={20} className="text-cyan-300" />
          </div>
          <div>
            <h2 className="text-xl font-black">AI Chat with Tender</h2>
            <p className="text-xs text-slate-400">Powered by Gemini 2.0 Flash Lite • Full tender context loaded</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">Context Ready</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {noKey && <NoApiKeyBanner />}
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} text={msg.text} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="px-6 py-3 border-t border-white/8">
        <p className="text-xs text-slate-500 mb-2 font-bold">Quick Questions</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isTyping}
              className="text-xs px-3 py-1.5 rounded-xl bg-white/6 border border-white/10 text-slate-300
                hover:bg-cyan-300/15 hover:border-cyan-300/30 hover:text-cyan-200 transition disabled:opacity-40"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-3">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about this tender… (Enter to send, Shift+Enter for new line)"
            rows={2}
            className="flex-1 rounded-2xl bg-white/8 border border-white/10 outline-none px-5 py-4
              focus:border-cyan-300 text-sm resize-none text-slate-200 placeholder:text-slate-500 transition"
          />
          <button
            onClick={() => sendMessage()}
            disabled={isTyping || !input.trim()}
            className="rounded-2xl bg-cyan-300 hover:bg-cyan-200 text-[#06111f] px-5 font-black
              transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isTyping ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
