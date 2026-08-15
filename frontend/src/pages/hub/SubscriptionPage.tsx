import React from "react";

import HubPageContent from "../../components/HubPageContent";
import AppShell from "../../layout/AppShell";

const SubscriptionPage: React.FC = () => (
  <AppShell>
    <HubPageContent
      title="Subscription Center"
      description="Manage your Sarathi AI plan, upgrades, renewals, and payment history."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-cyan-600/30 bg-cyan-600/10 p-6">
          <h2 className="text-lg font-semibold text-cyan-300">Current Plan</h2>
          <p className="mt-2 text-2xl font-bold text-white">Professional</p>
          <p className="mt-2 text-sm text-slate-400">Renews on 1 Sep 2026</p>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Upgrade</h2>
          <p className="mt-2 text-sm text-slate-400">
            Unlock enterprise PMIS, advanced AI models, and team collaboration.
          </p>
          <button
            type="button"
            className="mt-4 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
          >
            View Plans
          </button>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Renew</h2>
          <p className="mt-2 text-sm text-slate-400">
            Renew your subscription before expiry to avoid service interruption.
          </p>
          <button
            type="button"
            className="mt-4 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Renew Now
          </button>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Payment History</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li>Jul 2026 — Professional Plan — Paid</li>
            <li>Jun 2026 — Professional Plan — Paid</li>
            <li>May 2026 — Starter Plan — Paid</li>
          </ul>
        </section>
      </div>
    </HubPageContent>
  </AppShell>
);

export default SubscriptionPage;
