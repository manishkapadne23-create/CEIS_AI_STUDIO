import React from 'react';

interface HeroProps {
  onNavigateToChat?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToChat }) => {
  return (
    <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="mb-8 inline-block">
          <span className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-semibold tracking-wide">
            ✨ The World's First AI Platform for Engineering
          </span>
        </div>

        {/* Title */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 text-white leading-tight tracking-tight">
          <span className="block">CEIS AI</span>
        </h1>

        {/* Subtitle */}
        <p className="text-2xl sm:text-3xl text-slate-300 mb-8 font-medium">
          The World's First AI Platform for Civil, Highway & Infrastructure Engineering.
        </p>

        {/* Description */}
        <div className="mb-12 space-y-3 text-lg text-slate-400 max-w-3xl mx-auto">
          <p>✓ Ask engineering questions</p>
          <p>✓ Design highways</p>
          <p>✓ Review DPRs</p>
          <p>✓ Analyse contracts</p>
          <p>✓ Prepare estimates</p>
          <p>✓ Manage infrastructure projects</p>
          <p className="font-semibold text-cyan-300">All powered by AI.</p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={onNavigateToChat}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
          >
            Start Free AI Chat
          </button>
          <button className="px-8 py-4 border-2 border-cyan-500/30 hover:border-cyan-500/60 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-cyan-500/10">
            Explore Products
          </button>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 font-medium">
            ✓ Free AI Chat
          </span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 font-medium">
            ✓ Supports Indian Languages
          </span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 font-medium">
            ✓ Civil Engineering Focused
          </span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 font-medium">
            ✓ Secure Workspace
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
