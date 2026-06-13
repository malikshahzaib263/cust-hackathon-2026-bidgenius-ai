const API_BASE_URL = "http://127.0.0.1:8000";

export async function analyzeTender(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload-rfp`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to analyze RFP");
  }

  const data = await response.json();

  // Return backend response directly
  return data;
}