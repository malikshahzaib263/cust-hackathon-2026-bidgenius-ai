import { createContext, useContext, useState } from "react";
import { dashboardStats, requirements, evaluationCriteria, proposalSections } from "../data/dummyData";

const TenderContext = createContext(null);

export function TenderProvider({ children }) {
  const [tenderFile, setTenderFile] = useState(null);
  const [capabilityFile, setCapabilityFile] = useState(null);
  const [stats] = useState(dashboardStats);
  const [analysis] = useState({ requirements, evaluationCriteria });
  const [proposal, setProposal] = useState(proposalSections);

  return (
    <TenderContext.Provider
      value={{
        tenderFile,
        setTenderFile,
        capabilityFile,
        setCapabilityFile,
        stats,
        analysis,
        proposal,
        setProposal,
      }}
    >
      {children}
    </TenderContext.Provider>
  );
}

export function useTenderContext() {
  const context = useContext(TenderContext);
  if (!context) {
    throw new Error("useTenderContext must be used inside TenderProvider");
  }
  return context;
}
