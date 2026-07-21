import React from "react";
import { useNavigate } from "react-router-dom";

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