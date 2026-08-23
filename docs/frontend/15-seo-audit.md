# 15 — SEO / Metadata Audit

Context: authenticated internal business system. Public discoverability is irrelevant; browser-tab UX and share-preview hygiene are the only relevant concerns.

## Findings

### SEO-001 — Single Static Metadata for Entire App (LOW)
- Only `app/layout.jsx:16`: title "مخازن الجماز" + description. No `title.template`, no per-section titles → every tab reads identically across 40+ routes.
- No OpenGraph/Twitter cards, no canonical, no robots.txt, no sitemap.xml, no structured data.
- 404: no `not-found.jsx` (Next default English page shown in an Arabic app — jarring). Covered by FE-ARCH-001 + FE-NEXT-001.

## Semantic HTML
- Landmarks present in shell (`main`, header via component, nav inside Sidebar) — INFO, adequate.
- Document language/direction correct (`lang="ar" dir="rtl"`).

## Recommendation
Sprint 01 delivers: root `metadata.template`, per-layout titles (e.g. "الفواتير | مخازن الجماز"), `robots: {index:false}` meta for an internal tool, and Arabic `not-found.jsx`. Total effort ~1 task; no sitemap/OG needed for this product class.
