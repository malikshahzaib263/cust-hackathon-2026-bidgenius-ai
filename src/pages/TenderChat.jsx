import TenderChatComponent from "../components/chat/TenderChat";

export default function TenderChat() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-cyan-200 font-bold">AI Assistant</p>
        <h1 className="text-4xl font-black mt-2">Chat with Tender</h1>
        <p className="text-slate-400 mt-3 max-w-2xl">
          A strong hackathon feature: judges can ask questions and see instant explainable responses about the bid.
        </p>
      </section>

      <TenderChatComponent />
    </div>
  );
}
