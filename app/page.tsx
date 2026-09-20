"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Clipboard, Code2, ExternalLink, FileJson, Github, Image, LoaderCircle, Moon, Search, Sparkles, Sun, Wand2 } from "lucide-react";
import { compilePrompt, defaultBrief, describeNature, selectedEntries, toSchema, validateBrief, type PromptBrief } from "@/lib/prompt-builder";

const TYPES = [
  { value: "None", label: "Auto", icon: Sparkles, note: "Let the request choose the structure" },
  { value: "Write", label: "Writing", icon: Wand2, note: "Posts, emails, copy, and rewrites" },
  { value: "Research", label: "Research", icon: Search, note: "Explore, compare, and explain" },
  { value: "Plan", label: "Planning", icon: LoaderCircle, note: "Strategies, plans, and next steps" },
  { value: "Code", label: "Code", icon: Code2, note: "Build, fix, and review software" },
  { value: "Image prompt", label: "Image", icon: Image, note: "Describe a visual to create" },
] as const;

type Control = { key: keyof PromptBrief; label: string; options: string[] };
const SHARED_CONTROLS: Control[] = [
  { key: "tone", label: "Tone", options: ["None", "Clear", "Concise", "Creative", "Technical", "Friendly", "Professional"] },
  { key: "output", label: "Output", options: ["None", "Markdown", "JSON", "Table", "Checklist", "Timeline", "Step-by-step"] },
  { key: "detail", label: "Detail", options: ["None", "Brief", "Balanced", "In-depth"] },
];
const CONTROLS: Record<string, Control[]> = {
  None: SHARED_CONTROLS,
  Write: [...SHARED_CONTROLS,
    { key: "writingForm", label: "Format", options: ["None", "Email", "Post", "Article", "Script", "Ad copy"] },
    { key: "tone", label: "Tone", options: ["None", "Clear", "Friendly", "Persuasive", "Playful", "Professional"] },
    { key: "audience", label: "Audience", options: ["None", "General", "Beginner", "Professional", "Executive"] },
    { key: "writingIntent", label: "Purpose", options: ["None", "Inform", "Engage", "Persuade", "Sell", "Inspire"] },
    { key: "length", label: "Length", options: ["None", "Short", "Medium", "Long", "Long-form"] },
  ],
  Research: [...SHARED_CONTROLS,
    { key: "researchMode", label: "Mode", options: ["None", "Compare", "Explain", "Evaluate", "Summarize"] },
    { key: "sourcePolicy", label: "Sources", options: ["None", "Cite sources", "Primary sources", "No web sources"] },
    { key: "depth", label: "Depth", options: ["None", "Quick", "Balanced", "Thorough"] },
    { key: "researchScope", label: "Scope", options: ["None", "Overview", "Practical", "Academic", "Market"] },
    { key: "output", label: "Format", options: ["None", "Markdown", "Table", "Checklist", "JSON"] },
  ],
  Plan: [...SHARED_CONTROLS,
    { key: "planningHorizon", label: "Timeframe", options: ["None", "Today", "This week", "30 days", "Quarter"] },
    { key: "planningApproach", label: "Approach", options: ["None", "Step-by-step", "Milestones", "Prioritized", "Risk-first"] },
    { key: "audience", label: "For", options: ["None", "Individual", "Team", "Leadership", "Customer"] },
    { key: "priority", label: "Priority", options: ["None", "Speed", "Impact", "Cost", "Quality"] },
    { key: "output", label: "Format", options: ["None", "Checklist", "Timeline", "Table", "Markdown"] },
  ],
  Code: [...SHARED_CONTROLS,
    { key: "codeLanguage", label: "Language", options: ["None", "Python", "TypeScript", "JavaScript", "SQL", "Java", "Go", "Rust", "C#", "PHP"] },
    { key: "codeFramework", label: "Framework", options: ["None", "React", "Next.js", "FastAPI", "Django", "Node.js", "Flask", "Vue", "Express", "Spring Boot"] },
    { key: "codeIntent", label: "Task", options: ["None", "Write", "Debug", "Review", "Refactor", "Explain"] },
    { key: "codeTests", label: "Tests", options: ["None", "Include tests", "Test plan", "No tests"] },
    { key: "output", label: "Format", options: ["None", "Markdown", "JSON", "Step-by-step"] },
  ],
  "Image prompt": [...SHARED_CONTROLS,
    { key: "visualStyle", label: "Style", options: ["None", "Photorealistic", "Editorial", "Illustration", "3D render", "Minimal"] },
    { key: "aspectRatio", label: "Ratio", options: ["None", "1:1", "4:5", "16:9", "9:16"] },
    { key: "lighting", label: "Lighting", options: ["None", "Natural", "Studio", "Cinematic", "Soft"] },
    { key: "imageComposition", label: "Composition", options: ["None", "Close-up", "Wide shot", "Flat lay", "Rule of thirds"] },
    { key: "colorMood", label: "Colour", options: ["None", "Neutral", "Warm", "Cool", "High contrast"] },
  ],
};
const TYPE_ONLY_KEYS: Array<keyof PromptBrief> = ["audience", "writingForm", "writingIntent", "length", "researchMode", "sourcePolicy", "researchScope", "planningHorizon", "planningApproach", "priority", "codeLanguage", "codeFramework", "codeIntent", "codeTests", "visualStyle", "aspectRatio", "lighting", "imageComposition", "colorMood"];
const EXAMPLES = ["Write a launch plan for a new B2B product", "Explain this bug and suggest a safe fix", "Research a customer onboarding approach", "Turn rough notes into a clear email"];

export default function Page() {
  const [brief, setBrief] = useState<PromptBrief>(defaultBrief);
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dark, setDark] = useState(false);
  const schema = useMemo(() => toSchema(brief), [brief]);
  const prompt = useMemo(() => compilePrompt(brief), [brief]);
  const validation = useMemo(() => validateBrief(brief), [brief]);
  const writing = Boolean(brief.prompt.trim());
  const active = TYPES.find((item) => item.value === brief.task) ?? TYPES[0];
  const fields = CONTROLS[brief.task] ?? CONTROLS.None;
  const entries = selectedEntries(brief);
  const pillEntries = entries.filter(({ key }) => typeof brief[key] === "string");
  const quality = validation.score;
  const set = <K extends keyof PromptBrief>(key: K, value: PromptBrief[K]) => setBrief((current) => ({ ...current, [key]: value }));
  const changeTask = (task: string) => setBrief((current) => ({ ...current, task, ...Object.fromEntries(TYPE_ONLY_KEYS.map((key) => [key, "None"])) }) as PromptBrief);
  const copy = async () => { await navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  const setConstraints = (value: string) => set("constraints", value.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 10));

  return <main className={dark ? "dark" : ""}><div className="app-shell">
    <header className="site-header"><div className="brand"><span className="brand-mark">R</span><span>Prompt Refiner</span></div><div className="header-actions"><a className="mcp-link" href="https://prompt-builder.fastmcp.app/mcp" target="_blank" rel="noreferrer"><ExternalLink size={14} /> Use MCP</a><a className="community-link" href="https://github.com/TechQuanta" target="_blank" rel="noreferrer"><Github size={14} /> TechQuanta</a><a className="contribute" href="https://github.com/TechQuanta/prompt_builder" target="_blank" rel="noreferrer">Open source</a><button aria-label="Toggle theme" onClick={() => setDark(!dark)}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button></div></header>
    <section className="usage-reel" aria-label="Prompt Refiner animated usage preview"><div className="usage-copy"><p>Prompt Refiner in motion</p><h2>From rough thought<br />to useful direction.</h2><span>The controls stay close to the work. The result stays portable.</span></div><div className="usage-screen"><div className="usage-screen-top"><span><i /><i /><i /></span><b>prompt-refinement</b><small>live preview</small></div><div className="usage-screen-body"><div className="usage-input"><span className="typing-line">Write a launch plan for our new product</span><span className="typing-caret" /></div><div className="usage-controls"><span>Planning</span><span>Professional</span><span>Checklist</span></div><div className="usage-output"><small>REFINED PROMPT</small><strong>Make the next step clear.</strong><em>Structure the answer with useful decisions and a final checklist.</em></div></div></div></section>
    <section className="composer-zone"><div className="intro"><p>Prompt refinement</p><h1>Make the prompt<br />easy to understand.</h1><span>Choose a prompt type and use controls that match the work.</span></div>
      <div className={`composer ${writing ? "composer-active" : ""}`}>
        {writing && <div className="composer-toolbar"><div className="control-row"><div className="type-menu"><button onClick={() => setMenu(!menu)} className="type-trigger"><active.icon size={14} /><span>{active.label}</span><ChevronDown size={13} /></button>{menu && <div className="type-popover">{TYPES.map((item) => <button key={item.value} onClick={() => { changeTask(item.value); setMenu(false); }} className={item.value === brief.task ? "type-option selected" : "type-option"}><item.icon size={15} /><span><b>{item.label}</b><small>{item.note}</small></span></button>)}</div>}</div>{fields.map((field) => <MiniSelect key={String(field.key)} label={field.label} value={String(brief[field.key])} options={field.options} onChange={(value) => set(field.key, value as never)} />)}</div><div className="advanced-row"><label className="constraint-control"><span>Constraints</span><input aria-label="Constraints" value={brief.constraints.join(", ")} onChange={(event) => setConstraints(event.target.value)} placeholder="comma-separated requirements" /></label><label className="nature-control"><span>Prompt nature</span><small>Direct</small><input aria-label="Prompt nature" type="range" min="0" max="100" value={brief.promptNature} onChange={(event) => set("promptNature", Number(event.target.value))} /><b>{describeNature(brief.promptNature)}</b><small>Exploratory</small></label></div></div>}
        <textarea aria-label="Your prompt" value={brief.prompt} onChange={(event) => set("prompt", event.target.value)} placeholder="Ask anything, describe a task, or paste your rough notes…" />
        <div className="composer-footer"><span>{writing ? `${active.label} controls are active` : "Your prompt stays private in this browser"}</span><button className={writing && validation.valid ? "generate-ready" : "generate-disabled"} disabled={!writing || !validation.valid}>Refine <Sparkles size={15} /></button></div>
      </div>{writing && <div className="quality-meter"><span>Prompt signal</span><i><b style={{ width: `${quality}%` }} /></i><strong>{quality}%</strong></div>}
      {writing && validation.warnings.length > 0 && <p className="validation-note">{validation.warnings[0].message}</p>}
    </section>
    {!writing ? <section className="examples"><p>Try an example</p><div>{EXAMPLES.map((example) => <button key={example} onClick={() => set("prompt", example)}>{example}</button>)}</div></section> : <section className="result-area"><div className="selected-dots"><span>Refinements</span>{pillEntries.map(({ key, value }) => <button key={key} onClick={() => key === "task" ? changeTask("None") : set(key, "None" as never)}>{value} ×</button>)}</div><div className="result-grid"><article><div className="result-heading"><div><p>Refined prompt</p><h2>Ready for any model</h2></div><button onClick={copy}>{copied ? <Check size={15} /> : <Clipboard size={15} />} {copied ? "Copied" : "Copy"}</button></div><pre>{prompt}</pre></article><aside><div className="result-heading"><div><p>Portable contract</p><h2>prompt-refinement.json</h2></div><FileJson size={18} /></div><pre>{JSON.stringify(schema, null, 2)}</pre></aside></div></section>}
    <footer><span>Built with the <a href="https://github.com/TechQuanta" target="_blank" rel="noreferrer">TechQuanta Community</a></span><a className="footer-source" href="https://github.com/TechQuanta/prompt_builder" target="_blank" rel="noreferrer">View on GitHub</a></footer>
  </div></main>;
}

function MiniSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="compact-select"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
