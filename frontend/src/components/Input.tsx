import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className="space-y-2">
      {label ? <label className="text-sm font-medium text-slate-300">{label}</label> : null}
      <div className="relative">
        {icon ? (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
            {icon}
          </div>
        ) : null}
        <input
          className={`w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
