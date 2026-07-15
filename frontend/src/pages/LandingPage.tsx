import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import LanguageSupport from '../components/LanguageSupport';
import Products from '../components/Products';
import Pricing from '../components/Pricing';
import Roadmap from '../components/Roadmap';
import WhyCEIS from '../components/WhyCEIS';
import Footer from '../components/Footer';

interface LandingPageProps {
  onNavigateToChat?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToChat }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 opacity-40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <Header />
      <Hero onNavigateToChat={onNavigateToChat} />
      <LanguageSupport />
      <Products />
      <Pricing />
      <Roadmap />
      <WhyCEIS onNavigateToChat={onNavigateToChat} />
      <Footer />
    </div>
  );
};

export default LandingPage;
