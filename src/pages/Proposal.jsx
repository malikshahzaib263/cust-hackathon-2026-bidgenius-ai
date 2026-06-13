import ProposalPreview from "../components/proposal/ProposalPreview";
import ProposalEditor from "../components/proposal/ProposalEditor";
import ExportButton from "../components/proposal/ExportButton";

export default function Proposal() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <p className="text-cyan-200 font-bold">Proposal Generator</p>
          <h1 className="text-4xl font-black mt-2">AI Draft Proposal</h1>
          <p className="text-slate-400 mt-3 max-w-2xl">
            Review, edit, and export AI-generated sections mapped to tender requirements and company evidence.
          </p>
        </div>
        <ExportButton />
      </section>

      <div className="grid xl:grid-cols-2 gap-6">
        <ProposalPreview />
        <ProposalEditor />
      </div>
    </div>
  );
}
