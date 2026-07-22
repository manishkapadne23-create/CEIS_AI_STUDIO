import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import {
  createEngineeringDomain,
  deleteEngineeringDomain,
  fetchEngineeringDomains,
  updateEngineeringDomain,
  type EngineeringDomain,
} from "../services/engineeringDomains";

const emptyForm = {
  name: "",
  slug: "",
  icon: "🛠️",
  description: "",
  color: "#06b6d4",
  displayOrder: 0,
  isActive: true,
};

const EngineeringDomainsPage: React.FC = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState<EngineeringDomain[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    void loadDomains();
  }, []);

  const loadDomains = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchEngineeringDomains();
      setDomains(data);
    } catch (err: any) {
      setError(err.message || "Unable to load engineering domains.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDomains = useMemo(() => {
    const term = search.toLowerCase();
    return domains.filter((domain) => {
      return (
        domain.name.toLowerCase().includes(term) ||
        domain.description?.toLowerCase().includes(term) ||
        false
      );
    });
  }, [domains, search]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await updateEngineeringDomain(editingId, {
          ...form,
          displayOrder: Number(form.displayOrder),
        });
      } else {
        await createEngineeringDomain({
          ...form,
          displayOrder: Number(form.displayOrder),
        });
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadDomains();
    } catch (err: any) {
      setError(err.message || "Unable to save engineering domain.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (domain: EngineeringDomain) => {
    setEditingId(domain.id);
    setForm({
      name: domain.name,
      slug: domain.slug,
      icon: domain.icon || "🛠️",
      description: domain.description || "",
      color: domain.color || "#06b6d4",
      displayOrder: domain.displayOrder,
      isActive: domain.isActive,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this engineering domain?")) {
      return;
    }

    try {
      await deleteEngineeringDomain(id);
      await loadDomains();
    } catch (err: any) {
      setError(err.message || "Unable to delete engineering domain.");
    }
  };

  const toggleStatus = async (domain: EngineeringDomain) => {
    try {
      await updateEngineeringDomain(domain.id, { isActive: !domain.isActive });
      await loadDomains();
    } catch (err: any) {
      setError(err.message || "Unable to toggle engineering domain status.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">CEIS AI Studio</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Engineering Domains</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Manage the disciplines that power engineering intelligence, domain selection, and AI context.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
            <Button onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}>New Domain</Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-slate-800/80 bg-slate-900/80">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Domain Library</h2>
                <p className="text-sm text-slate-400">Search, enable, edit, or remove engineering disciplines.</p>
              </div>
              <Input
                placeholder="Search domains"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            {error ? <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div> : null}

            {loading ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-sm text-slate-400">Loading domains…</div>
            ) : filteredDomains.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-8 text-center text-sm text-slate-400">
                No engineering domains found.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDomains.map((domain) => (
                  <div key={domain.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: `${domain.color || "#06b6d4"}20` }}>
                          {domain.icon || "🛠️"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-white">{domain.name}</h3>
                            <span className={`rounded-full px-2 py-1 text-xs ${domain.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-700 text-slate-300"}`}>
                              {domain.isActive ? "Active" : "Disabled"}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-slate-400">{domain.description || "No description provided."}</p>
                          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">Slug: {domain.slug}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" onClick={() => toggleStatus(domain)}>{domain.isActive ? "Disable" : "Enable"}</Button>
                        <Button variant="secondary" onClick={() => handleEdit(domain)}>Edit</Button>
                        <Button variant="ghost" onClick={() => handleDelete(domain.id)}>Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="border-slate-800/80 bg-slate-900/80">
            <h2 className="text-xl font-semibold text-white">{editingId ? "Edit Domain" : "Add New Domain"}</h2>
            <p className="mt-2 text-sm text-slate-400">Create or modify a domain that will appear on the home page and in the AI chat context.</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <Input label="Domain Name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required />
              <Input label="Slug" value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} placeholder="e.g. software-engineering" />
              <Input label="Icon" value={form.icon} onChange={(event) => setForm((prev) => ({ ...prev, icon: event.target.value }))} placeholder="🛠️" />
              <Input label="Color" type="color" value={form.color} onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))} />
              <Input label="Display Order" type="number" value={form.displayOrder} onChange={(event) => setForm((prev) => ({ ...prev, displayOrder: Number(event.target.value) }))} />
              <Input label="Description" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
              <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
                <input type="checkbox" checked={form.isActive} onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))} />
                Active
              </label>
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Update Domain" : "Create Domain"}</Button>
                <Button variant="secondary" type="button" onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}>Reset</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EngineeringDomainsPage;
