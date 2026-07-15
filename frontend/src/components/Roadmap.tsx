import React from 'react';

interface RoadmapCardProps {
  title: string;
  icon: string;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ title, icon }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/40 to-slate-800/20 p-6 hover:border-cyan-500/30 transition-all duration-300">
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />

      <div className="text-3xl mb-3">{icon}</div>
      <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
        {title}
      </h4>
      <p className="text-xs text-slate-500 mt-2">Coming Soon</p>
    </div>
  );
};

const Roadmap: React.FC = () => {
  const roadmapItems = [
    { title: 'AI Agents', icon: '🤖' },
    { title: 'Highway Design Automation', icon: '🛣️' },
    { title: 'Bridge Design Automation', icon: '🌉' },
    { title: 'Smart DPR Generator', icon: '📄' },
    { title: 'Auto BOQ Generator', icon: '📊' },
    { title: 'Auto Estimate Generator', icon: '💰' },
    { title: 'Tender Intelligence', icon: '📢' },
    { title: 'Infrastructure ERP', icon: '⚙️' },
    { title: 'Construction Analytics', icon: '📈' },
    { title: 'Engineering Knowledge Hub', icon: '📚' },
  ];

  return (
    <section id="roadmap" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Coming Soon</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Exciting features and automations coming to CEIS AI.
          </p>
        </div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {roadmapItems.map((item, index) => (
            <RoadmapCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
