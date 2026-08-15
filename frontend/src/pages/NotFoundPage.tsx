import React from "react";
import { Link } from "react-router-dom";

import AppShell from "../layout/AppShell";

const NotFoundPage: React.FC = () => (
  <AppShell>
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-white">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-400">
        The page you requested does not exist or may have been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-8 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500"
      >
        Return Home
      </Link>
    </div>
  </AppShell>
);

export default NotFoundPage;
