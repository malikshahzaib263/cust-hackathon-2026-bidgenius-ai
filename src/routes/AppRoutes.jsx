import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import UploadTender from "../pages/UploadTender";
import Analysis from "../pages/Analysis";
import Proposal from "../pages/Proposal";
import TenderChat from "../pages/TenderChat";
import Settings from "../pages/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/upload" element={<UploadTender />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/proposal" element={<Proposal />} />
      <Route path="/chat" element={<TenderChat />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
