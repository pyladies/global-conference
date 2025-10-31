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