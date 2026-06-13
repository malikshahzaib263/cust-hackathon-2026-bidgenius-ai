import { useNavigate } from "react-router-dom";
import FileUploader from "../components/upload/FileUploader";
import useTenderAnalysis from "../hooks/useTenderAnalysis";
import { useTenderContext } from "../context/TenderContext";

export default function UploadTender() {
  const navigate = useNavigate();
  const { tenderFile } = useTenderContext();
  const { loading, error, runAnalysis } = useTenderAnalysis();

  async function handleAnalyze() {
    if (!tenderFile) {
      alert("Please upload RFP/Tender PDF first");
      return;
    }

    if (!tenderFile.name.toLowerCase().endsWith(".pdf")) {
      alert("Only PDF files are supported right now");
      return;
    }

    const result = await runAnalysis(tenderFile);

    if (result) {
      localStorage.setItem("bidgenius_result", JSON.stringify(result));
      navigate("/analysis");
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-cyan-200 font-bold">Workspace Setup</p>

        <h1 className="text-4xl font-black mt-2">
          Upload Tender / RFP Document
        </h1>

        <p className="text-slate-400 mt-3 max-w-2xl">
          Upload a PDF tender document. BidGenius AI will extract requirements,
          run NER, retrieve RAG evidence from the capability library, calculate
          compliance, and predict win probability.
        </p>
      </section>

      <section className="grid lg:grid-cols-1 gap-6">
        <FileUploader />
      </section>

      {error && (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-red-200">
          {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full md:w-auto bg-cyan-300 hover:bg-cyan-200 disabled:opacity-60 disabled:cursor-not-allowed text-[#06111f] px-8 py-4 rounded-2xl font-black text-lg transition"
      >
        {loading ? "Analyzing RFP..." : "Analyze RFP"}
      </button>
    </div>
  );
}