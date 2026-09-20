export type PromptBrief = {
  prompt:string; task:string; tone:string; output:string; audience:string; depth:string;
  writingForm:string; researchMode:string; sourcePolicy:string; planningHorizon:string;
  codeLanguage:string; codeFramework:string; codeIntent:string;
  visualStyle:string; aspectRatio:string; lighting:string;
  constraints:string[]; creativity:number; detail:number; structure:number;
};
export const defaultBrief:PromptBrief={prompt:"",task:"None",tone:"None",output:"None",audience:"None",depth:"None",writingForm:"None",researchMode:"None",sourcePolicy:"None",planningHorizon:"None",codeLanguage:"None",codeFramework:"None",codeIntent:"None",visualStyle:"None",aspectRatio:"None",lighting:"None",constraints:[],creativity:50,detail:50,structure:50};
const labels:Record<string,string>={task:"Prompt type",tone:"Tone",output:"Output",audience:"Audience",depth:"Depth",writingForm:"Writing format",researchMode:"Research mode",sourcePolicy:"Sources",planningHorizon:"Time horizon",codeLanguage:"Language",codeFramework:"Framework",codeIntent:"Code task",visualStyle:"Visual style",aspectRatio:"Aspect ratio",lighting:"Lighting"};
export function selectedEntries(b:PromptBrief){return Object.entries(b).filter(([key,value])=>key!=="prompt"&&key!=="constraints"&&value!=="None"&&(typeof value!=="number"||value!==50)).map(([key,value])=>({key:key as keyof PromptBrief,label:labels[key]??key,value:String(value)}));}
export function compilePrompt(b:PromptBrief){const lines=selectedEntries(b).map(({label,value})=>`${label}: ${value}`);if(b.constraints.length)lines.push(`Constraints: ${b.constraints.join("; ")}`);return `User request: ${b.prompt||"[Enter your prompt]"}\n${lines.join("\n")}\n\nRefine the response around the selected controls. Keep assumptions explicit and do not invent facts.`;}
export function toSchema(b:PromptBrief){return {schema_version:"1.1",type:"prompt_refinement",user_prompt:b.prompt||null,selections:Object.fromEntries(selectedEntries(b).map(({key,value})=>[key,value])),completeness:{score:b.prompt.trim()?100:0,missing_fields:b.prompt.trim()?[]:["user_prompt"]}};}
