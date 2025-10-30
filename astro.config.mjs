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

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "https://conference.pyladies.com",
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
