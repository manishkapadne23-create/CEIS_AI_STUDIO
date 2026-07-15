import React from 'react';

interface LogoProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ title = 'Sarathi Intelligence', subtitle = 'PMIS', className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-lg font-semibold text-white shadow-lg shadow-cyan-500/20">
        S
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
};

export default Logo;
