import React from 'react';

interface FeatureProps {
  title: string;
  icon: string;
}

interface WhyCEISProps {
  onNavigateToChat?: () => void;
}

const Feature: React.FC<FeatureProps> = ({ title, icon }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="text-2xl">{icon}</div>
      <span className="text-slate-300 font-medium">{title}</span>
    </div>
  );
};

const WhyCEIS: React.FC<WhyCEISProps> = ({ onNavigateToChat }) => {
  const features = [
    { title: 'Civil Engineering Specialist AI', icon: '🏗️' },
    { title: 'Highway Engineering', icon: '🛣️' },
    { title: 'Bridge Engineering', icon: '🌉' },
    { title: 'Project Management', icon: '📊' },
    { title: 'Contract Management', icon: '📜' },
    { title: 'Tender Preparation', icon: '📋' },
    { title: 'Quantity Estimation', icon: '📐' },
    { title: 'IRC / IS Codes', icon: '📖' },
    { title: 'MORTH Specifications', icon: '✓' },
    { title: 'BIS Standards', icon: '✓' },
    { title: 'Multi-language AI', icon: '🌐' },
    { title: 'Future-ready AI Platform', icon: '🚀' },
  ];

  return (
    <section id="why" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Why CEIS AI?</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Built specifically for Indian engineering professionals and standards.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <button
            onClick={onNavigateToChat}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
          >
            Experience the Future of Engineering
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyCEIS;
