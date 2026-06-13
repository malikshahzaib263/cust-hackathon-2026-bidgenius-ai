import UploadBox from "./UploadBox";
import { useTenderContext } from "../../context/TenderContext";

export default function CapabilityUploader() {
  const { capabilityFile, setCapabilityFile } = useTenderContext();

  return (
    <UploadBox
      title="Upload Capability Library"
      description="Upload company profile, certifications, CVs, and case studies."
      file={capabilityFile}
      onFile={setCapabilityFile}
    />
  );
}
