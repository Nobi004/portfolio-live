import { siteDescription, siteUrl } from "@/lib/site";

export function PersonJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Md. Mahmudun Nobi",
    jobTitle: "AI Engineer",
    description: siteDescription,
    url: siteUrl,
    address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
    sameAs: ["https://github.com/Nobi004"],
  };
  return <script type="application/ld+json">{JSON.stringify(json)}</script>;
}
