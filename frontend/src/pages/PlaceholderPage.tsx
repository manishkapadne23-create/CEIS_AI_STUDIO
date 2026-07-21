type PlaceholderPageProps = {
  title: string;
  description: string;
};

function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/80 p-10 shadow-2xl">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-400">CEIS AI Studio</p>
        <h1 className="mb-4 text-3xl font-semibold">{title}</h1>
        <p className="text-lg text-slate-300">{description}</p>
      </div>
    </div>
  );
}

export default PlaceholderPage;
