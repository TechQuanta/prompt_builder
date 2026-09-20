export type PromptBrief = {
  goal: string;
  audience: string;
  context: string;
  constraints: string[];
  outputFormat: string;
  tone: string;
  provider: "universal" | "chatgpt" | "claude" | "gemini";
};

export const defaultBrief: PromptBrief = {
  goal: "",
  audience: "",
  context: "",
  constraints: [],
  outputFormat: "Markdown",
  tone: "Clear and practical",
  provider: "universal",
};

const labels: Record<keyof Pick<PromptBrief, "goal" | "audience" | "context" | "outputFormat" | "tone">, string> = {
  goal: "goal", audience: "audience", context: "context", outputFormat: "output format", tone: "tone",
};

export function missingFields(brief: PromptBrief) {
  return (Object.keys(labels) as (keyof typeof labels)[]).filter((key) => !brief[key].trim()).map((key) => labels[key]);
}

export function compilePrompt(brief: PromptBrief, variant: "focused" | "detailed" | "structured") {
  const constraints = brief.constraints.filter(Boolean);
  const providerNote = brief.provider === "claude"
    ? "Think carefully before answering. State material assumptions."
    : brief.provider === "chatgpt"
      ? "Follow the requested output format exactly. Ask a concise question only when essential information is missing."
      : brief.provider === "gemini"
        ? "Use clear sections and make uncertainty explicit."
        : "Make assumptions explicit and do not invent facts.";
  const detail = variant === "focused"
    ? "Give a direct answer with only the essential reasoning."
    : variant === "structured"
      ? "Use headings, a short summary, and a final checklist."
      : "Work through the request carefully and explain important choices.";
  return `You are helping with the following task.\n\nGoal: ${brief.goal || "[define the goal]"}\nAudience: ${brief.audience || "[define the audience]"}\nContext: ${brief.context || "[add useful context]"}\nConstraints: ${constraints.length ? constraints.join("; ") : "None provided"}\nTone: ${brief.tone || "Clear and practical"}\n\n${detail}\n${providerNote}\n\nReturn the result as: ${brief.outputFormat || "Markdown"}.`;
}

export function toSchema(brief: PromptBrief) {
  const missing = missingFields(brief);
  const score = Math.round(((5 - missing.length) / 5) * 100);
  return {
    schema_version: "1.0",
    type: "prompt_brief",
    provider: brief.provider,
    brief: {
      goal: brief.goal || null,
      audience: brief.audience || null,
      context: brief.context || null,
      constraints: brief.constraints.filter(Boolean),
      output_format: brief.outputFormat || null,
      tone: brief.tone || null,
    },
    completeness: { score, missing_fields: missing },
  };
}
