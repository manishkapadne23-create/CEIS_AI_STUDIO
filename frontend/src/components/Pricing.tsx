import React from 'react';

interface PricingCardProps {
  title: string;
  price: string | number;
  description: string;
  features: string[];
  isPopular: boolean;
  cta: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, description, features, isPopular, cta }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border transition-all duration-500 group ${isPopular ? 'border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 shadow-2xl shadow-cyan-500/30 ring-2 ring-cyan-500/30' : 'border-white/10 bg-gradient-to-br from-slate-900/40 to-slate-800/20 hover:border-cyan-500/30'}`}>
      {/* Background gradient effect */}
      <div className={`absolute inset-0 -z-10 ${isPopular ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-500 bg-gradient-to-br from-cyan-500/5 to-blue-500/5`} />

      {isPopular && (
        <div className="absolute top-0 right-0 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold">
          MOST POPULAR
        </div>
      )}

      <div className="p-8">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-6">{description}</p>

        {/* Price */}
        <div className="mb-8">
          {typeof price === 'number' ? (
            <div className="flex items-baseline">
              <span className="text-sm text-slate-400">₹</span>
              <span className="text-5xl font-bold text-white">{price}</span>
              <span className="text-slate-400 ml-2">/month</span>
            </div>
          ) : (
            <div className="text-4xl font-bold text-white">{price}</div>
          )}
        </div>

        {/* CTA Button */}
        <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 mb-8 ${isPopular ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transform hover:scale-105' : 'border-2 border-white/10 text-slate-300 hover:border-cyan-500/50 hover:text-white'}`}>
          {cta}
        </button>

        {/* Features */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">FEATURES INCLUDED</p>
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-300 text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Pricing: React.FC = () => {
  const plans = [
    {
      title: 'FREE',
      price: 'Free',
      description: 'Get started with AI-powered engineering',
      features: [
        'Unlimited Civil Engineering AI Chat',
        'Multi-language Support',
        'Basic Engineering Assistance',
      ],
      isPopular: false,
      cta: 'Start for Free',
    },
    {
      title: 'STANDARD',
      price: 199,
      description: 'For professional engineers',
      features: [
        'Everything in Free',
        'Advanced AI Capabilities',
        'Drawing Review',
        'Document Upload',
        'IRC / IS / MORTH Assistance',
        'Advanced Calculations',
      ],
      isPopular: true,
      cta: 'Start 7-Day Trial',
    },
    {
      title: 'PRO',
      price: 399,
      description: 'For teams and enterprises',
      features: [
        'Everything in Standard',
        'Contract Analysis',
        'Project Intelligence',
        'Priority AI Support',
        'Smart Reports',
        'Advanced Design Assistance',
      ],
      isPopular: false,
      cta: 'Start 7-Day Trial',
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choose the right plan for your engineering needs. Always flexible to scale.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>

        <p className="text-center text-slate-400 mt-12">
          All plans include a 7-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
