import React from 'react';

const LanguageSupport: React.FC = () => {
  const languages = [
    { name: 'English', code: 'EN' },
    { name: 'मराठी', code: 'MR' },
    { name: 'हिन्दी', code: 'HI' },
    { name: 'தமிழ்', code: 'TA' },
    { name: 'తెలుగు', code: 'TE' },
    { name: 'ಕನ್ನಡ', code: 'KN' },
    { name: 'മലയാളം', code: 'ML' },
    { name: 'বাংলা', code: 'BN' },
    { name: 'ગુજરાતી', code: 'GU' },
    { name: 'ਪੰਜਾਬੀ', code: 'PA' },
    { name: 'ଓଡ଼ିଆ', code: 'OR' },
    { name: 'অসমীয়া', code: 'AS' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/30 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Supports</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Ask questions in any Indian language. CEIS AI understands and responds in your preferred language.
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {languages.map((lang, index) => (
            <div
              key={index}
              className="group p-4 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300 cursor-pointer text-center"
            >
              <p className="text-sm font-semibold text-slate-300 group-hover:text-cyan-300 transition-colors">
                {lang.name}
              </p>
              <p className="text-xs text-slate-500 mt-1">{lang.code}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LanguageSupport;
