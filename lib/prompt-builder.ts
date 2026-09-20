export type PromptBrief = {
  prompt: string; task: string; tone: string; output: string; audience: string; depth: string; detail: string;
  writingForm: string; writingIntent: string; length: string; researchMode: string; sourcePolicy: string; researchScope: string;
  planningHorizon: string; planningApproach: string; priority: string; codeLanguage: string; codeFramework: string; codeIntent: string;
  codeTests: string; visualStyle: string; aspectRatio: string; lighting: string; imageComposition: string; colorMood: string;
  promptNature: number; constraints: string[];
};

export const defaultBrief: PromptBrief = {
  prompt: "", task: "None", tone: "None", output: "None", audience: "None", depth: "None", detail: "None",
  writingForm: "None", writingIntent: "None", length: "None", researchMode: "None", sourcePolicy: "None", researchScope: "None",
  planningHorizon: "None", planningApproach: "None", priority: "None", codeLanguage: "None", codeFramework: "None", codeIntent: "None",
  codeTests: "None", visualStyle: "None", aspectRatio: "None", lighting: "None", imageComposition: "None", colorMood: "None",
  promptNature: 50, constraints: [],
};

const labels: Record<string, string> = {
  task: "Prompt type", tone: "Tone", output: "Output", audience: "Audience", depth: "Depth", detail: "Detail", writingForm: "Writing format",
  writingIntent: "Writing purpose", length: "Length", researchMode: "Research mode", sourcePolicy: "Sources", researchScope: "Research scope",
  planningHorizon: "Time horizon", planningApproach: "Planning approach", priority: "Priority", codeLanguage: "Language",
  codeFramework: "Framework", codeIntent: "Code task", codeTests: "Testing", visualStyle: "Visual style", aspectRatio: "Aspect ratio",
  lighting: "Lighting", imageComposition: "Composition", colorMood: "Colour mood", promptNature: "Prompt nature",
};

const contractKeys: Record<string, string> = {
  writingForm: "writing_form", writingIntent: "writing_intent", researchMode: "research_mode", sourcePolicy: "source_policy",
  researchScope: "research_scope", planningHorizon: "planning_horizon", planningApproach: "planning_approach", codeLanguage: "code_language",
  codeFramework: "code_framework", codeIntent: "code_intent", codeTests: "code_tests", visualStyle: "visual_style",
  aspectRatio: "aspect_ratio", imageComposition: "image_composition", colorMood: "color_mood", promptNature: "prompt_nature",
};

export function describeNature(value: number) {
  if (value < 34) return "Direct";
  if (value > 66) return "Exploratory";
  return "Balanced";
}

export function selectedEntries(brief: PromptBrief) {
  return Object.entries(brief)
    .filter(([key, value]) => key !== "prompt" && key !== "constraints" && value !== "None" && (typeof value !== "number" || value !== 50))
    .map(([key, value]) => ({ key: key as keyof PromptBrief, label: labels[key] ?? key, value: key === "promptNature" ? describeNature(Number(value)) : String(value) }));
}

export function compilePrompt(brief: PromptBrief) {
  const lines = selectedEntries(brief).map(({ label, value }) => `${label}: ${value}`);
  if (brief.constraints.length) lines.push(`Constraints: ${brief.constraints.join("; ")}`);
  return `User request: ${brief.prompt || "[Enter your prompt]"}\n${lines.join("\n")}\n\nRefine the response around the selected controls. Keep assumptions explicit and do not invent facts.`;
}

export function toSchema(brief: PromptBrief) {
  const selections = Object.fromEntries(selectedEntries(brief).map(({ key }) => [contractKeys[String(key)] ?? key, brief[key]]));
  return { schema_version: "1.2", type: "prompt_refinement", user_prompt: brief.prompt || null, ...selections };
}
