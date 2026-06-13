import { useState } from "react";
import { analyzeTender } from "../services/api";

export default function useTenderAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runAnalysis(file) {
    setLoading(true);
    setError("");

    try {
      const result = await analyzeTender(file);

      return result;
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to analyze RFP document"
      );

      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    runAnalysis,
  };
}