import React, { type ReactNode } from "react";

interface HubPageContentProps {
  title: string;
  description: string;
  children?: ReactNode;
}

const HubPageContent: React.FC<HubPageContentProps> = ({
  title,
  description,
  children,
}) => (
  <div className="mx-auto max-w-6xl p-6 sm:p-8">
    <div className="mb-8">
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Sarathi AI</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
      <p className="mt-3 max-w-3xl text-slate-400">{description}</p>
    </div>
    {children}
  </div>
);

export default HubPageContent;
