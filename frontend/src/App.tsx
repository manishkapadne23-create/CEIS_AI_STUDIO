import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import EngineeringDomainsPage from "./pages/EngineeringDomainsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/engineering" element={<EngineeringDomainsPage />} />
        <Route path="/learning" element={<PlaceholderPage title="Learning Hub" description="Learning modules and training content will appear here." />} />
        <Route path="/documents" element={<PlaceholderPage title="Documents" description="Project documents and knowledge resources will appear here." />} />
        <Route path="/tools" element={<PlaceholderPage title="Engineering Tools" description="Calculation and productivity tools will appear here." />} />
        <Route path="/pmis" element={<PlaceholderPage title="PMIS" description="PMIS workflows and enterprise integrations will appear here." />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;