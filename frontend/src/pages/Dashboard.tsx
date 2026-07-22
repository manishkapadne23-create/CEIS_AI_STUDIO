import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEngineeringDomains, type EngineeringDomain } from "../services/engineeringDomains";

const modules = [
  {
    title: "AI Chat TEST",
    icon: "🤖",
    description: "Ask engineering questions with CEIS AI",
    route: "/chat",
  },
  {
    title: "Engineering Hub",
    icon: "🏗️",
    description: "Civil, Mechanical, Electrical & more",
    route: "/engineering",
  },
  {
    title: "Learning Hub",
    icon: "🎓",
    description: "Courses, Notes, MCQs and Viva",
    route: "/learning",
  },
  {
    title: "Documents",
    icon: "📄",
    description: "Manage drawings, PDFs and reports",
    route: "/documents",
  },
  {
    title: "Engineering Tools",
    icon: "🧮",
    description: "Design tools, BOQ and Estimation",
    route: "/tools",
  },
  {
    title: "PMIS Enterprise",
    icon: "📊",
    description: "Professional Project Management",
    route: "/pmis",
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState<EngineeringDomain[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEngineeringDomains();
        setDomains(data.filter((domain) => domain.isActive));
        const storedId = localStorage.getItem("selectedEngineeringDomainId");
        if (storedId) {
          setSelectedDomainId(storedId);
        }
      } catch (error) {
        console.error("Unable to load engineering domains", error);
      }
    };

    void load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-7xl px-8 py-6">
          <h1 className="text-4xl font-bold text-cyan-400">
            CEIS AI
          </h1>

          <p className="mt-2 text-slate-400">
            Engineering Intelligence Platform
          </p>
        </div>
      </header>

      {/* Dashboard */}
      <main className="mx-auto max-w-7xl p-8">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Engineering Domains</h2>
              <p className="mt-2 text-sm text-slate-400">Select a discipline to set the AI context for your next conversation.</p>
            </div>
            <button
              onClick={() => navigate("/engineering")}
              className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/20"
            >
              Manage Domains
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => {
                  setSelectedDomainId(domain.id);
                  localStorage.setItem("selectedEngineeringDomainId", domain.id);
                  localStorage.setItem("selectedEngineeringDomainName", domain.name);
                  navigate("/chat");
                }}
                className={`rounded-2xl border p-4 text-left transition hover:border-cyan-500 hover:bg-slate-800 ${selectedDomainId === domain.id ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10" : "border-slate-800 bg-slate-950/70"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: `${domain.color || "#06b6d4"}20` }}>
                    {domain.icon || "🛠️"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{domain.name}</h3>
                    <p className="text-sm text-slate-400">{domain.description || "Engineering discipline"}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {modules.map((module) => (

            <div
              key={module.title}
              onClick={() => navigate(module.route)}
              className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-900/20"
            >
              <div className="text-5xl">
                {module.icon}
              </div>

              <h2 className="mt-6 text-2xl font-semibold">
                {module.title}
              </h2>

              <p className="mt-3 text-slate-400">
                {module.description}
              </p>

            </div>

          ))}

        </div>
      </main>

    </div>
  );
};

export default Dashboard;