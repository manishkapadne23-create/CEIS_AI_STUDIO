import React from "react";

import HubPageContent from "../../components/HubPageContent";
import AppShell from "../../layout/AppShell";

const WalletPage: React.FC = () => (
  <AppShell>
    <HubPageContent
      title="Wallet"
      description="Referral earnings, withdrawal status, and transaction history."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 md:col-span-1">
          <h2 className="text-lg font-semibold text-white">Balance</h2>
          <p className="mt-3 text-3xl font-bold text-cyan-400">₹ 2,450.00</p>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-white">Referral Earnings</h2>
          <p className="mt-2 text-sm text-slate-400">
            Earn rewards when colleagues join Sarathi AI using your referral link.
          </p>
          <p className="mt-4 text-sm text-slate-300">This month: ₹ 850.00</p>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Withdrawal Status</h2>
          <p className="mt-2 text-sm text-emerald-400">No pending withdrawals</p>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-white">Transaction History</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li>+ ₹ 500 — Referral bonus — 28 Jul 2026</li>
            <li>+ ₹ 350 — Referral bonus — 15 Jul 2026</li>
            <li>- ₹ 1,000 — Withdrawal — 1 Jul 2026</li>
          </ul>
        </section>
      </div>
    </HubPageContent>
  </AppShell>
);

export default WalletPage;
