import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import config from "./src/config/config.json";
import remarkToc from 'remark-toc';


let highlighter;
async function getHighlighter() {
  if (!highlighter) {
    const { getHighlighter } = await import("shiki");
    highlighter = await getHighlighter({ theme: "one-dark-pro" });
  }
  return highlighter;
}

// Production is served from GitHub Pages, and Netlify only ever builds pull
// request previews, so these variables are absent from the production build.
// The CONTEXT guard keeps it that way even if production ever moves to Netlify:
// DEPLOY_PRIME_URL would be set there too, and would quietly replace the custom
// domain. DEPLOY_PRIME_URL is stable for the life of a pull request, unlike
// DEPLOY_URL, which changes with every commit.
const isNetlifyPreview =
  process.env.CONTEXT === "deploy-preview" ||
  process.env.CONTEXT === "branch-deploy";
const previewUrl = isNetlifyPreview ? process.env.DEPLOY_PRIME_URL : undefined;

// https://astro.build/config
export default defineConfig({
  site:
    previewUrl ||
    (config.site.base_url ? config.site.base_url : "https://conference.pyladies.com"),
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  vite: { plugins: [tailwindcss()] },
  integrations: [
    react(),
    sitemap(),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
      ],
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [ [remarkToc, { heading: 'toc', maxDepth: 3 } ] ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
    highlighter: getHighlighter,
  },
  redirects: {
    "/docs/committee_coc": "/docs/volunteers/coc",
    "/docs/committee_communications": "/docs/volunteers/committee_communications",
    "/docs/committee_design": "/docs/volunteers/committee_design",
    "/docs/committee_finance": "/docs/volunteers/committee_finance",
    "/docs/committee_infra": "/docs/volunteers/committee_infra",
    "/docs/committee_program": "/docs/volunteers/committee_program",
    "/docs/committee_volunteers": "/docs/volunteers/committee_volunteers",
    "/docs/roles_and_responsibilities": "/docs/volunteers/roles_and_responsibilities",
    "/docs/speaker_guide": "/docs/speakers/speaker_guide",
  }
});
