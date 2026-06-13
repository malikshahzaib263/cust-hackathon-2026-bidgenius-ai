import UploadBox from "./UploadBox";
import { useTenderContext } from "../../context/TenderContext";

export default function FileUploader() {
  const { tenderFile, setTenderFile } = useTenderContext();

  return (
    <UploadBox
      title="Upload Tender / RFP"
      description="Upload government, enterprise, RFQ, RFP, or tender document."
      file={tenderFile}
      onFile={setTenderFile}
    />
  );
}
