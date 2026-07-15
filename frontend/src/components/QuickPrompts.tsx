import React from 'react';

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const QuickPrompts: React.FC<QuickPromptsProps> = ({ onSelectPrompt }) => {
  const prompts = [
    { label: 'Design Flexible Pavement', icon: '🛣️' },
    { label: 'Estimate Road Project', icon: '💰' },
    { label: 'Explain IRC Code', icon: '📖' },
    { label: 'Draft Tender Clause', icon: '📋' },
    { label: 'Review BOQ', icon: '📊' },
    { label: 'Highway Geometric Design', icon: '📐' },
    { label: 'Concrete Mix Design', icon: '🧪' },
    { label: 'Contract Claim Analysis', icon: '⚖️' },
  ];

  return (
    <div className="px-4 py-6 border-t border-white/10 bg-slate-950/50">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Quick prompts</p>
      <div className="grid grid-cols-2 gap-3">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(prompt.label)}
            className="group p-3 rounded-lg border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300 text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{prompt.icon}</span>
              <span className="text-xs font-medium text-slate-300 group-hover:text-cyan-300 transition-colors line-clamp-2">
                {prompt.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickPrompts;
