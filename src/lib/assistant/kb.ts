export interface KbChunk {
  sourceRoute: string;
  sourceTitle: string;
  heading: string;
  text: string;
}

const STOPWORDS = new Set(
  "a,an,the,and,or,but,of,to,in,on,for,with,what,which,who,how,does,do,is,are,he,his,him,has,have,had,was,were,be,been,by,about,can,could,should,would,there,their,they,it,its,as,at,from,that,this,these,those,you,your,i,me,my,we,our".split(","),
);

export function stem(w: string): string {
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 4 && w.endsWith("es")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s")) return w.slice(0, -1);
  if (w.length > 5 && w.endsWith("ic")) return w.slice(0, -2);
  return w;
}

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
    .map(stem);
}

export function scoreChunk(queryTokens: string[], chunk: KbChunk): number {
  const hay = new Set(tokenize(`${chunk.sourceTitle} ${chunk.heading} ${chunk.text}`));
  let score = 0;
  for (const t of queryTokens) if (hay.has(t)) score += 1;
  return score;
}

export interface Retrieval {
  chunks: KbChunk[];
  topScore: number;
}

export function retrieve(query: string, all: KbChunk[], maxChunks: number): Retrieval {
  const tokens = tokenize(query);
  const ranked = all
    .map((chunk) => ({ chunk, score: scoreChunk(tokens, chunk) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
  return { chunks: ranked.map((r) => r.chunk), topScore: ranked[0]?.score ?? 0 };
}

export function buildContext(chunks: KbChunk[], wordBudget: number): string {
  let words = 0;
  const out: string[] = [];
  for (const c of chunks) {
    const body = `[${c.sourceTitle}](${c.sourceRoute})${c.heading ? ` — ${c.heading}` : ""}\n${c.text}`;
    const n = body.split(/\s+/).length;
    if (words + n > wordBudget) break;
    words += n;
    out.push(body);
  }
  return out.join("\n\n");
}
