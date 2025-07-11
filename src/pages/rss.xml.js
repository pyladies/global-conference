import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context) {
  return rss({
    // `<title>` field in output xml
    title: 'PyLadiesCon News and Announcements',
    // `<description>` field in output xml
    description: 'News and announcements from PyLadiesCon, a Global PyLadies Conference.',
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#site
    site: context.site,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: await pagesGlobToRssItems(
      import.meta.glob('../posts/*.{md,mdx}'),
    ),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
}

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const blog = await getCollection('posts');
  return rss({
    title: 'PyLadiesCon News and Announcements',
    description: 'News and announcements from PyLadiesCon, a Global PyLadies Conference.',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      // Compute RSS link from post `id`
      // This example assumes all posts are rendered as `/blog/[id]` routes
      link: `/${post.id}/`,
      content: post.content,
      customData: '<language>en-us</language>',

    })),
  });
}