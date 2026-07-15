import React from 'react';

interface ProductCardProps {
  title: string;
  description: string;
  icon: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, description, icon }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/40 to-slate-800/20 p-6 hover:border-cyan-500/50 transition-all duration-500 cursor-pointer">
      {/* Hover gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-500" />

      {/* Animated border glow on hover */}
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl" />
      </div>

      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">{icon}</span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
        {description}
      </p>

      <div className="mt-4 flex items-center text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>Learn more</span>
        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

const Products: React.FC = () => {
  const products = [
    {
      title: 'CEIS AI',
      description: 'Unlimited Civil Engineering AI Chat',
      icon: '💬',
    },
    {
      title: 'CEIS PMIS',
      description: 'AI Project Management Information System',
      icon: '📊',
    },
    {
      title: 'Highway Design Suite',
      description: 'Advanced highway design and analysis',
      icon: '🛣️',
    },
    {
      title: 'Bridge Design Suite',
      description: 'Professional bridge engineering tools',
      icon: '🌉',
    },
    {
      title: 'Quantity & Estimation',
      description: 'Smart BOQ and cost estimation',
      icon: '📐',
    },
    {
      title: 'Tender Management',
      description: 'Streamlined tender preparation',
      icon: '📋',
    },
    {
      title: 'Contract Management',
      description: 'Intelligent contract analysis',
      icon: '📜',
    },
    {
      title: 'GIS & Survey Intelligence',
      description: 'Geospatial data analysis',
      icon: '🗺️',
    },
    {
      title: 'Trading Intelligence',
      description: 'Market trends and insights',
      icon: '📈',
    },
    {
      title: 'CEIS Academy',
      description: 'Learn engineering with AI',
      icon: '🎓',
    },
    {
      title: 'Independent Director Suite',
      description: 'Executive insights and reporting',
      icon: '🏛️',
    },
    {
      title: 'Document Intelligence',
      description: 'AI-powered document analysis',
      icon: '🧠',
    },
  ];

  return (
    <section id="products" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Complete Product Suite</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Everything you need for modern engineering. All powered by AI.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
