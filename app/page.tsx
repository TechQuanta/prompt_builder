"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Clipboard, Code2, FileJson, Image, LoaderCircle, Search, Sparkles, Wand2 } from "lucide-react";
import { compilePrompt, defaultBrief, toSchema, type PromptBrief } from "@/lib/prompt-builder";

const promptTypes = [
  { value: "None", label: "Auto", icon: Sparkles, note: "Choose the best approach from your request" },
  { value: "Write", label: "Writing", icon: Wand2, note: "Posts, emails, copy, and rewrites" },
  { value: "Research", label: "Research", icon: Search, note: "Explore, compare, and explain" },
  { value: "Plan", label: "Planning", icon: LoaderCircle, note: "Plans, strategies, and next steps" },
  { value: "Code", label: "Code", icon: Code2, note: "Build, fix, and review software" },
  { value: "Image prompt", label: "Image", icon: Image, note: "Describe a visual to create" },
] as const;

const examples = ["Write a launch plan for a new B2B product", "Explain this bug and suggest a safe fix", "Research the best approach for a customer onboarding flow", "Turn my rough notes into a clear email"];

export default function PromptBuilderPage() {
  const [brief, setBrief] = useState<PromptBrief>(defaultBrief);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const schema = useMemo(() => toSchema(brief), [brief]);
  const prompt = useMemo(() => compilePrompt(brief), [brief]);
  const isWriting = brief.prompt.trim().length > 0;
  const selected = promptTypes.find((item) => item.value === brief.task) ?? promptTypes[0];
  const set = <K extends keyof PromptBrief>(key: K, value: PromptBrief[K]) => setBrief((current) => ({ ...current, [key]: value }));
  const copy = async () => { await navigator.clipboard.writeText(prompt); setCopied(true); window.setTimeout(() => setCopied(false), 1200); };

  return <main><div className="app-shell"><header className="site-header"><div className="brand"><span className="brand-mark">P</span><span>Prompt Builder</span></div><span className="local-badge">Local workspace</span></header><section className="composer-zone"><div className="intro"><p>Prompt Builder</p><h1>What do you want to create?</h1><span>Start with the idea. Add a prompt type only when it helps.</span></div><div className={`composer ${isWriting ? "composer-active" : ""}`}>
    {isWriting && <div className="composer-toolbar"><div className="type-menu"><button onClick={() => setOpen(!open)} className="type-trigger"><selected.icon size={14}/><span>{selected.label}</span><ChevronDown size={13}/></button>{open && <div className="type-popover">{promptTypes.map((item) => <button key={item.value} onClick={() => { set("task", item.value); setOpen(false); }} className={item.value === brief.task ? "type-option selected" : "type-option"}><item.icon size={15}/><span><b>{item.label}</b><small>{item.note}</small></span></button>)}</div>}</div><CompactSelect label="Tone" value={brief.tone} options={["None", "Clear", "Concise", "Creative", "Technical"]} onChange={(value) => set("tone", value)} /><CompactSelect label="Output" value={brief.output} options={["None", "Markdown", "JSON", "Table", "Checklist"]} onChange={(value) => set("output", value)} /></div>}
    <textarea aria-label="Your prompt" value={brief.prompt} onChange={(event) => set("prompt", event.target.value)} placeholder="Ask anything, describe a task, or paste your rough notes…" />
    <div className="composer-footer"><span>{isWriting ? "Controls stay optional" : "Your prompt stays private in this browser"}</span><button className={isWriting ? "generate-ready" : "generate-disabled"} disabled={!isWriting}>Generate <Sparkles size={15}/></button></div>
  </div></section>
  {!isWriting ? <section className="examples"><p>Try an example</p><div>{examples.map((example) => <button key={example} onClick={() => set("prompt", example)}>{example}</button>)}</div></section> : <section className="result-area"><div className="selected-dots"><span>Selected</span>{brief.task !== "None" && <button onClick={() => set("task", "None")}>{selected.label} ×</button>}{brief.tone !== "None" && <button onClick={() => set("tone", "None")}>{brief.tone} ×</button>}{brief.output !== "None" && <button onClick={() => set("output", "None")}>{brief.output} ×</button>}</div><div className="result-grid"><article><div className="result-heading"><div><p>Generated prompt</p><h2>Ready to use</h2></div><button onClick={copy}>{copied ? "Copied" : "Copy"} <Clipboard size={15}/></button></div><pre>{prompt}</pre></article><aside><div className="result-heading"><div><p>Live schema</p><h2>prompt-brief.json</h2></div><FileJson size={18}/></div><pre>{JSON.stringify(schema, null, 2)}</pre></aside></div></section>}</div></main>;
}

function CompactSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="compact-select"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
