import React from "react";

const PageSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4 p-6 sm:p-8">
    <div className="h-8 w-48 rounded-lg bg-slate-800" />
    <div className="h-4 w-full max-w-2xl rounded bg-slate-800/80" />
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-36 rounded-2xl border border-slate-800 bg-slate-900/60"
        />
      ))}
    </div>
  </div>
);

export default PageSkeleton;
