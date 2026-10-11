export const siteName = "Md. Mahmudun Nobi — AI Engineer";

export const siteDescription =
  "AI Engineer focused on agentic systems, applied machine learning, document intelligence, and production software architecture.";

// Set NEXT_PUBLIC_SITE_URL at deploy time (e.g. https://nobi.dev). Localhost fallback is dev-only.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
