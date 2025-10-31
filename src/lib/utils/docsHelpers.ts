import type { CollectionEntry } from "astro:content";
import { sortByWeight } from "./sortFunctions";
import { humanize } from "./textConverter";

export type DocsSection = {
  key: string;
  title: string;
  docs: CollectionEntry<"docs">[];
};

const SECTION_LABELS: Record<string, string> = {
  volunteers: "Volunteer Guides",
  speakers: "Speaker Guides",
  resources: "Resources",
  sponsorship: "Sponsorship Guides"
};

const SECTION_ORDER = ["speakers", "volunteers", "sponsorship", "resources"] as const;

const resolveSectionKey = (doc: CollectionEntry<"docs">): string => {
  // use explicit section if available
  if (doc.data.section) {
    return doc.data.section.trim().toLowerCase();
  }

  const firstSegment = doc.id.split("/")[0];
  if (firstSegment === doc.id) { // doc is at root level
    return "general";
  }
  return firstSegment.toLowerCase(); // infer from first subdirectory
};

const getSectionLabel = (key: string): string => {
  return SECTION_LABELS[key.toLowerCase()] ?? humanize(key);
};

const getSectionOrderIndex = (key: string): number => {
  const index = SECTION_ORDER.indexOf(key.toLowerCase() as any);
  return index === -1 ? SECTION_ORDER.length : index;
};

export const groupDocsBySection = (
  docs: CollectionEntry<"docs">[],
): DocsSection[] => {
  const grouped = new Map<string, CollectionEntry<"docs">[]>();

  // group doc entries by section key
  docs.forEach((doc) => {
    const key = resolveSectionKey(doc);
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(doc);
  });

  // transform grouped map into sorted array of sections
  return Array.from(grouped.entries())
    .map(([key, sectionDocs]) => ({
      key,
      title: getSectionLabel(key),
      docs: sortByWeight(sectionDocs),
    }))
    .sort((a, b) => {
      const orderDiff = getSectionOrderIndex(a.key) - getSectionOrderIndex(b.key);
      return orderDiff !== 0 ? orderDiff : a.title.localeCompare(b.title);
    });
};

export const resolveDocSlug = (entry: CollectionEntry<"docs">): string => {
  return entry.id.replace(/\.(md|mdx)$/i, "").replace(/^\/+|\/+$/g, "");
};

export { getSectionLabel };
