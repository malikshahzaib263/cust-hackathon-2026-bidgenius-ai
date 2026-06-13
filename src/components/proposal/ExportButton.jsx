import { useState } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { useTenderContext } from "../../context/TenderContext";
import jsPDF from "jspdf";

function getStoredResult() {
  try {
    return JSON.parse(localStorage.getItem("bidgenius_result")) || {};
  } catch {
    return {};
  }
}

export default function ExportButton() {
  const { proposal } = useTenderContext();
  const [exported, setExported] = useState(false);

  function handleExport() {
    const result = getStoredResult();

    const doc = new jsPDF();
    let y = 18;

    doc.setFontSize(20);
    doc.text("BidGenius AI - Proposal Draft", 15, y);

    y += 12;

    doc.setFontSize(10);
    doc.text(`Tender: ${result.filename || "Uploaded RFP"}`, 15, y);
    y += 7;
    doc.text(`Sector: ${result.sector || "Not detected"}`, 15, y);
    y += 7;
    doc.text(`Deadline: ${result.deadline || "Not found"}`, 15, y);
    y += 7;
    doc.text(`Win Probability: ${result.win_probability ?? "N/A"}%`, 15, y);
    y += 7;
    doc.text(`Decision: ${result.decision || "N/A"}`, 15, y);
    y += 7;
    doc.text(`Compliance Score: ${result.compliance?.compliance_score ?? "N/A"}%`, 15, y);

    y += 12;

    doc.setFontSize(14);
    doc.text("Extracted Requirements", 15, y);
    y += 8;

    doc.setFontSize(9);
    (result.requirements || []).slice(0, 8).forEach((req, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${req}`, 180);
      doc.text(lines, 15, y);
      y += lines.length * 5 + 3;

      if (y > 270) {
        doc.addPage();
        y = 18;
      }
    });

    y += 6;

    doc.setFontSize(14);
    doc.text("Compliance Gaps", 15, y);
    y += 8;

    doc.setFontSize(9);

    const gaps = result.compliance?.gaps || [];

    if (gaps.length) {
      gaps.slice(0, 8).forEach((gap, i) => {
        const lines = doc.splitTextToSize(`${i + 1}. ${gap}`, 180);
        doc.text(lines, 15, y);
        y += lines.length * 5 + 3;

        if (y > 270) {
          doc.addPage();
          y = 18;
        }
      });
    } else {
      doc.text("No major compliance gaps found.", 15, y);
      y += 8;
    }

    proposal.forEach((section, i) => {
      if (y > 245) {
        doc.addPage();
        y = 18;
      }

      y += 8;

      doc.setFontSize(14);
      doc.text(`${i + 1}. ${section.title}`, 15, y);

      y += 8;

      doc.setFontSize(10);

      const bodyLines = doc.splitTextToSize(section.body, 180);
      doc.text(bodyLines, 15, y);

      y += bodyLines.length * 5 + 8;
    });

    doc.save(`BidGenius-Proposal-${Date.now()}.pdf`);

    setExported(true);
    setTimeout(() => setExported(false), 3000);
  }

  return (
    <button
      onClick={handleExport}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition ${
        exported
          ? "bg-emerald-400 text-[#06111f]"
          : "bg-cyan-300 hover:bg-cyan-200 text-[#06111f]"
      }`}
    >
      {exported ? (
        <>
          <CheckCircle2 size={18} />
          Downloaded PDF!
        </>
      ) : (
        <>
          <Download size={18} />
          Export PDF
        </>
      )}
    </button>
  );
}