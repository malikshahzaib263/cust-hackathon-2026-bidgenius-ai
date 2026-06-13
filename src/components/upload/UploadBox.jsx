import { UploadCloud, FileText } from "lucide-react";
import { validateFile } from "../../services/uploadService";

export default function UploadBox({ title, description, file, onFile }) {
  function handleChange(event) {
    const selected = event.target.files?.[0];
    const result = validateFile(selected);
    if (!result.valid) {
      alert(result.message);
      return;
    }
    onFile(selected);
  }

  return (
    <label className="block rounded-3xl border-2 border-dashed border-cyan-300/35 bg-cyan-300/5 p-8 text-center cursor-pointer hover:bg-cyan-300/10 transition">
      <UploadCloud className="mx-auto text-cyan-300 mb-4" size={46} />
      <h3 className="text-2xl font-black">{title}</h3>
      <p className="text-slate-400 mt-2">{description}</p>

      <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleChange} />

      <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 text-sm">
        <FileText size={16} />
        {file ? file.name : "Choose PDF/DOCX"}
      </div>
    </label>
  );
}
