import React, { useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Logo from '../../components/Logo';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300">
              Secure Enterprise Access
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Project Management Intelligence System
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-400">
                Empower delivery, operations, and leadership teams with real-time visibility, AI-assisted decisions, and reliable execution across every portfolio.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-sm font-semibold text-white">Operational clarity</p>
                <p className="mt-1 text-sm text-slate-400">Track milestones, risks, and performance in one intelligent workspace.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-sm font-semibold text-white">Trusted governance</p>
                <p className="mt-1 text-sm text-slate-400">Move confidently with secure access and enterprise-ready controls.</p>
              </div>
            </div>
          </div>

          <Card className="mx-auto w-full max-w-md border-slate-800/80 bg-slate-900/80">
            <div className="mb-8 flex justify-center">
              <Logo title="Sarathi Intelligence" subtitle="PMIS" />
            </div>

            <div className="mb-8 space-y-2 text-center">
              <h2 className="text-3xl font-semibold text-white">Welcome Back</h2>
              <p className="text-sm text-slate-400">Sign in to continue to your PMIS workspace.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                label="Username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                icon={
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM5 20a7 7 0 0114 0" />
                  </svg>
                }
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                icon={
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-4 0h8m-6-6V8a2 2 0 114 0v3m-5 0h8a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4a2 2 0 012-2z" />
                  </svg>
                }
              />

              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-400"
                  />
                  Remember Me
                </label>
                <a href="#" className="text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300">
                  Forgot Password?
                </a>
              </div>

              <Button type="submit" className="w-full py-3 text-base">
                Sign In
              </Button>
            </form>
          </Card>
        </div>

        <footer className="mt-8 text-center text-sm text-slate-500">
          © 2026 Sarathi Intelligence. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
