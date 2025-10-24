---
draft: true
title: "Documentation Inception"
---

# Documentation

This directory contains all documentation organized into sections.

## Structure

- **`volunteers/`** - Guides for conference volunteers and committee members
- **`speakers/`** - Information and guides for speakers
- **`resources/`** - External resources and helpful links

## Adding a New Doc

Create a markdown file in the appropriate subfolder:

```bash
# For volunteer guides
src/content/docs/volunteers/your-guide.md

# For speaker guides
src/content/docs/speakers/your-guide.md

# For other resources
src/content/docs/resources/your-resource.md
```

## Frontmatter

Basic frontmatter structure:

```yaml
---
title: "Your Doc Title"
description: "Brief description"
section: "volunteers"  # optional - inferred from folder if not specified
weight: 1              # optional - controls ordering within section
---
```

## External Resources

To link to an external resource instead of creating a doc page:

```yaml
---
title: "Astro Framework"
description: "Learn about Astro"
section: "resources"
url: "https://astro.build"  # opens in new tab with icon
---
```

## Section Ordering

Sections appear in this order:

1. Speakers
2. Volunteers
3. Resources
4. Any other sections (alphabetically)

Within each section, docs are sorted by `weight` (lower numbers first).

## Creating a New Section

You can add new sections by simply creating a new folder:

```bash
src/content/docs/sponsors/sponsor-info.md
```

This will automatically create a "Sponsors" section. The section name is inferred from the folder name and humanized (e.g., `my-section` becomes "My Section").

### Customizing Section Labels and Order

To customize section display names and ordering, edit `src/lib/utils/docsHelpers.ts`:

**1. Add a custom label:**

```typescript
const SECTION_LABELS: Record<string, string> = {
  volunteers: "Volunteer Guides",
  speakers: "Speaker Guides",
  resources: "Resources",
  sponsors: "Sponsor Information",  // add your new section here
};
```

**2. Add to the ordering:**

```typescript
const SECTION_ORDER = ["speakers", "volunteers", "resources", "sponsors"] as const;
```

Sections not in `SECTION_ORDER` will appear after the ordered ones, sorted alphabetically.
