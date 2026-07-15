import React from 'react';

interface WelcomeScreenProps {
  onQuickPrompt: (prompt: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onQuickPrompt }) => {
  const specializations = [
    '🛣️ Highway Engineering',
    '🏗️ Civil Engineering',
    '🌉 Bridge Engineering',
    '🏔️ Geotechnical Engineering',
    '🚦 Traffic Engineering',
    '📜 Contracts & Claims',
    '📊 Quantity Estimation',
    '📋 DPR Preparation',
    '📢 Tender Documents',
    '📈 Project Management',
    '📖 IRC Codes',
    '✓ IS Codes',
    '🛣️ MoRTH Specifications',
    '📑 FIDIC',
    '💼 PMIS',
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 pb-20">
      {/* Logo and Title */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">⚙</span>
          </div>
        </div>
        <h1 className="text-5xl font-bold text-white mb-2">Welcome to CEIS AI</h1>
        <p className="text-xl text-cyan-300 mb-4">India's Engineering Intelligence Platform</p>
      </div>

      {/* Specializations */}
      <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 max-w-2xl w-full mb-8">
        <p className="text-slate-300 font-semibold mb-6 text-center">Specialized in:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {specializations.map((spec, index) => (
            <div
              key={index}
              className="px-4 py-3 rounded-lg bg-slate-800/50 border border-white/5 hover:border-cyan-500/30 text-slate-300 text-sm text-center transition-all duration-300 hover:text-cyan-300"
            >
              {spec}
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="text-center text-slate-400 text-sm max-w-2xl mb-8">
        <p>
          CEIS AI is your dedicated engineering assistant. Ask anything about civil engineering, highway design, project management, contracts, and Indian standards. Get instant insights, analyze documents, and accelerate your engineering projects.
        </p>
      </div>

      {/* Start Button */}
      <button
        onClick={() => onQuickPrompt('How can CEIS AI help me with my project?')}
        className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-cyan-500/30 mb-12"
      >
        Start Chatting
      </button>
    </div>
  );
};

export default WelcomeScreen;
