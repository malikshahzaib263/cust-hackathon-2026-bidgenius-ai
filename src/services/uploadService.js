export function validateFile(file) {
  if (!file) return { valid: false, message: "No file selected" };

  const allowed = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowed.includes(file.type) && !file.name.endsWith(".pdf") && !file.name.endsWith(".docx")) {
    return { valid: false, message: "Only PDF or DOCX files are supported" };
  }

  return { valid: true, message: "File accepted" };
}
