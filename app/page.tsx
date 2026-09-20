"use client";

import { useMemo, useState } from "react";
import { Braces, CheckCircle2, Clipboard, FileJson, Plus, Sparkles, Wand2 } from "lucide-react";
import { compilePrompt, defaultBrief, missingFields, toSchema, type PromptBrief } from "@/lib/prompt-builder";

const variants = ["focused", "detailed", "structured"] as const;

export default function PromptBuilderPage() {
  const [brief, setBrief] = useState<PromptBrief>(defaultBrief);
  const [variant, setVariant] = useState<(typeof variants)[number]>("structured");
  const [constraint, setConstraint] = useState("");
  const [copied, setCopied] = useState(false);
  const schema = useMemo(() => toSchema(brief), [brief]);
  const prompt = useMemo(() => compilePrompt(brief, variant), [brief, variant]);
  const update = <K extends keyof PromptBrief>(key: K, value: PromptBrief[K]) => setBrief((current) => ({ ...current, [key]: value }));
  const addConstraint = () => {
    const value = constraint.trim();
    if (value && !brief.constraints.includes(value)) update("constraints", [...brief.constraints, value]);
    setConstraint("");
  };
  const copy = async () => { await navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 1600); };

  return (
    <main className="min-h-screen bg-[#0b1020] text-slate-100 selection:bg-cyan-300/30">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-cyan-300 text-slate-950"><Wand2 size={19}/></span><div><h1 className="font-semibold tracking-tight">Prompt Builder</h1><p className="text-xs text-slate-400">Deterministic prompt design</p></div></div>
        <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex"><CheckCircle2 size={15} className="text-emerald-300"/> Schema v1.0 · local-first</div>
      </header>

      <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[370px_minmax(0,1fr)_440px]">
        <section className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r lg:p-7">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">Brief controls</p>
          <div className="space-y-4">
            <Field label="Goal" value={brief.goal} placeholder="What should the AI help create?" onChange={(value) => update("goal", value)} multiline />
            <Field label="Audience" value={brief.audience} placeholder="Who is this for?" onChange={(value) => update("audience", value)} />
            <Field label="Context" value={brief.context} placeholder="Facts, background, source material" onChange={(value) => update("context", value)} multiline />
            <Field label="Output format" value={brief.outputFormat} placeholder="Markdown, JSON, table…" onChange={(value) => update("outputFormat", value)} />
            <Field label="Tone" value={brief.tone} placeholder="Clear and practical" onChange={(value) => update("tone", value)} />
            <label className="block text-sm text-slate-300">Target provider<select aria-label="Target provider" className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-cyan-300" value={brief.provider} onChange={(event) => update("provider", event.target.value as PromptBrief["provider"])}><option value="universal">Universal</option><option value="chatgpt">ChatGPT</option><option value="claude">Claude</option><option value="gemini">Gemini</option></select></label>
            <div><label className="text-sm text-slate-300">Constraints</label><div className="mt-2 flex gap-2"><input aria-label="Add a constraint" value={constraint} onChange={(event) => setConstraint(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addConstraint()} placeholder="Add a rule" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"/><button aria-label="Add constraint" onClick={addConstraint} className="rounded-lg border border-white/10 px-3 text-cyan-200 hover:bg-white/10"><Plus size={17}/></button></div><div className="mt-2 flex flex-wrap gap-2">{brief.constraints.map((item) => <button key={item} onClick={() => update("constraints", brief.constraints.filter((value) => value !== item))} className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-xs text-cyan-100">{item} ×</button>)}</div></div>
          </div>
        </section>

        <section className="flex min-w-0 flex-col p-5 lg:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">Prompt preview</p><h2 className="mt-1 text-xl font-semibold">Choose a deterministic variant</h2></div><button onClick={copy} className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-3.5 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-200"><Clipboard size={16}/>{copied ? "Copied" : "Copy prompt"}</button></div>
          <div className="mt-6 flex flex-wrap gap-2">{variants.map((item) => <button key={item} onClick={() => setVariant(item)} className={`rounded-full px-3 py-1.5 text-sm capitalize transition ${variant === item ? "bg-white text-slate-950" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}>{item}</button>)}</div>
          <pre className="mt-5 min-h-[340px] flex-1 whitespace-pre-wrap rounded-xl border border-white/10 bg-[#11182b] p-5 font-mono text-sm leading-6 text-slate-200 shadow-2xl shadow-black/20">{prompt}</pre>
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-300/20 bg-amber-300/5 p-3 text-sm text-amber-100"><Sparkles size={16} className="mt-0.5 shrink-0"/>{missingFields(brief).length ? `Add ${missingFields(brief).join(", ")} to improve this prompt.` : "Your brief is complete and ready to export."}</div>
        </section>

        <aside className="border-t border-white/10 bg-[#0e1527] p-5 lg:border-l lg:border-t-0 lg:p-7"><div className="flex items-center gap-2"><FileJson size={18} className="text-cyan-300"/><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">Live JSON schema</p><p className="mt-1 text-sm text-slate-400">Updates as the brief changes</p></div></div><div className="mt-6 rounded-xl border border-white/10 bg-black/20"><div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-xs text-slate-400"><Braces size={14}/> prompt-brief.json <span className="ml-auto text-emerald-300">{schema.completeness.score}% complete</span></div><pre className="max-h-[calc(100vh-230px)] overflow-auto p-4 font-mono text-xs leading-5 text-cyan-50">{JSON.stringify(schema, null, 2)}</pre></div></aside>
      </div>
    </main>
  );
}

function Field({ label, value, placeholder, onChange, multiline = false }: { label: string; value: string; placeholder: string; onChange: (value: string) => void; multiline?: boolean }) {
  const className = "mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300";
  return <label className="block text-sm text-slate-300">{label}{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${className} min-h-20 resize-y`}/> : <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={className}/>}</label>;
}
