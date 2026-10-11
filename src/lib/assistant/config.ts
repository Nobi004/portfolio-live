export const assistantConfig = {
  maxChunks: 4,
  wordBudget: 1500,
  rateLimit: 20,
  rateWindowMs: 600_000,
  maxTurns: 8,
  maxInputChars: 1000,
  requestTimeoutMs: 25_000,
  minScore: 1,
  defaultModel: "openai/gpt-4o-mini",
  maxOutputTokens: 500,
} as const;

export const openRouterKey = process.env.OPENROUTER_API_KEY ?? "";
export const openRouterModel = process.env.OPENROUTER_MODEL ?? assistantConfig.defaultModel;
