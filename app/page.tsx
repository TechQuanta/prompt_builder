"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Clipboard, Code2, FileJson, Image, LoaderCircle, Search, Sparkles, Wand2 } from "lucide-react";
import { compilePrompt, defaultBrief, toSchema, type PromptBrief } from "@/lib/prompt-builder";

const types = [
  { value: "None", label: "Auto", icon: Sparkles, note: "Let the request choose the structure" },
  { value: "Write", label: "Writing", icon: Wand2, note: "Posts, emails, copy, rewrites" },
  { value: "Research", label: "Research", icon: Search, note: "Explore, compare, explain" },
  { value: "Plan", label: "Planning", icon: LoaderCircle, note: "Plans, strategies, next steps" },
  { value: "Code", label: "Code", icon: Code2, note: "Build, fix, review software" },
  { value: "Image prompt", label: "Image", icon: Image, note: "Describe a visual to create" },
] as const;
const examples = ["Write a launch plan for a new B2B product", "Explain this bug and suggest a safe fix", "Research a customer onboarding approach", "Turn rough notes into a clear email"];

export default function PromptRefinerPage() {
  const [brief, setBrief] = useState<PromptBrief>(defaultBrief);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const schema = useMemo(() => toSchema(brief), [brief]);
  const prompt = useMemo(() => compilePrompt(brief), [brief]);
  const active = types.find((item) => item.value === brief.task) ?? types[0];
  const isWriting = Boolean(brief.prompt.trim());
  const quality = Math.min(100, Math.round(brief.prompt.trim().length * 1.5) + (brief.task !== "None" ? 20 : 0) + (brief.tone !== "None" ? 12 : 0) + (brief.output !== "None" ? 12 : 0));
  const set = <K extends keyof PromptBrief>(key: K, value: PromptBrief[K]) => setBrief((current) => ({ ...current, [key]: value }));
  const copy = async () => { await navigator.clipboard.writeText(prompt); setCopied(true); window.setTimeout(() => setCopied(false), 1200); };

  return <main><div className="app-shell"><header className="site-header"><div className="brand"><span className="brand-mark">R</span><span>Prompt Refiner</span></div><span className="local-badge">Prompt quality layer</span></header><section className="composer-zone"><div className="intro"><p>Prompt refinement</p><h1>Make the prompt<br/>easy to understand.</h1><span>Refine intent, structure, constraints, and output before any model sees it.</span></div><div className={`composer ${isWriting ? "composer-active" : ""}`}>
    {isWriting && <div className="composer-toolbar"><div className="type-menu"><button onClick={() => setMenuOpen(!menuOpen)} className="type-trigger"><active.icon size={14}/><span>{active.label}</span><ChevronDown size={13}/></button>{menuOpen && <div className="type-popover">{types.map((item) => <button key={item.value} onClick={() => { set("task", item.value); setMenuOpen(false); }} className={item.value === brief.task ? "type-option selected" : "type-option"}><item.icon size={15}/><span><b>{item.label}</b><small>{item.note}</small></span></button>)}</div>}</div><MiniSelect label="Tone" value={brief.tone} options={["None", "Clear", "Concise", "Creative", "Technical"]} onChange={(value) => set("tone", value)} /><MiniSelect label="Output" value={brief.output} options={["None", "Markdown", "JSON", "Table", "Checklist"]} onChange={(value) => set("output", value)} /></div>}
    <textarea aria-label="Your prompt" value={brief.prompt} onChange={(event) => set("prompt", event.target.value)} placeholder="Ask anything, describe a task, or paste your rough notes…" />
    <div className="composer-footer"><span>{isWriting ? "Nothing leaves your browser" : "Your prompt stays private in this browser"}</span><button className={isWriting ? "generate-ready" : "generate-disabled"} disabled={!isWriting}>Refine <Sparkles size={15}/></button></div>
  </div>{isWriting && <div className="quality-meter"><span>Prompt signal</span><i><b style={{ width: `${quality}%` }} /></i><strong>{quality}%</strong></div>}</section>
  {!isWriting ? <section className="examples"><p>Try an example</p><div>{examples.map((example) => <button key={example} onClick={() => set("prompt", example)}>{example}</button>)}</div></section> : <section className="result-area"><div className="selected-dots"><span>Refinements</span>{brief.task !== "None" && <button onClick={() => set("task", "None")}>{active.label} ×</button>}{brief.tone !== "None" && <button onClick={() => set("tone", "None")}>{brief.tone} ×</button>}{brief.output !== "None" && <button onClick={() => set("output", "None")}>{brief.output} ×</button>}</div><div className="result-grid"><article><div className="result-heading"><div><p>Refined prompt</p><h2>Ready for any model</h2></div><button onClick={copy}>{copied ? <Check size={15} /> : <Clipboard size={15} />}{copied ? "Copied" : "Copy"}</button></div><pre>{prompt}</pre></article><aside><div className="result-heading"><div><p>Portable contract</p><h2>prompt-brief.json</h2></div><FileJson size={18}/></div><pre>{JSON.stringify(schema, null, 2)}</pre></aside></div></section>}</div></main>;
}
function MiniSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="compact-select"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
