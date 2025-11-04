---
title: "Workflow: Blog posts"
meta_title: "Workflow: Blog posts"
description: "Workflow for requesting and submiting a blog post"
section: "website"
draft: false
---

## Request Blog Post Workflow

**For the communications team**

### 1. Blog Post Request Initiation

* **Who:** Any team member
* **Where:** GitHub ([PyLadiesCon repo](https://github.com/global-conference) – Pull request)

Create a Pull Request with the title: `Blog Post: [Proposed Title]`
and assign to: Denny (Communications Lead).

The content should be in a markdown file in the
[src/content/posts](https://github.com/pyladies/global-conference/tree/main/src/content/posts)
directory.

You can see other files in the directory as an example,
but the most important thing is to include the following information
at the beginning of the file:

```
---
title: "Your title"
meta_title: "Your meta title"
description: "Short description of the post"
date: 2025-06-02T05:00:00Z
categories: ["Blog Post",]
image: "/images/posts/default2025.png"
authors: ["YourName"]
tags: ["the", "tags", "of", "your", "posts"]
draft: false
---

Here you start writing your post

```

Please be mindful that the `date` needs to be updated,
and an optional header can also be updated in the
[public/images/posts](https://github.com/pyladies/global-conference/tree/main/public/images/posts)
directory, or you can request it in the next step.

Please indicate if the content is ready or needs to be finished.

#### Add or update your Author page (one-time)

To display your name, avatar, and bio on blog posts and your author profile page, create your author file in the authors collection. You only need to do this once per author.

* Where: `src/content/authors/`
* Filename: use a lowercase, kebab-case slug of your name, for example: `lais.md`, `cheuk.md`
* Image: add your photo to `public/images/authors/` and reference it in the frontmatter

Example author file (`src/content/authors/your-slug.md`):

```
---
title: "Your Name"
meta_title: "About Your Name"
image: "/images/authors/your-slug.jpg"
description: "Short bio, 1–2 sentences."
social:
  github: "https://github.com/yourhandle"
  linkedin: "https://www.linkedin.com/in/yourhandle/"
  twitter: "https://twitter.com/yourhandle"
  mastodon: "https://mastodon.social/@yourhandle"
  instagram: "https://instagram.com/yourhandle"
  bluesky: "https://bsky.app/profile/yourhandle.bsky.social"
---

Your longer bio can go here!
```

Important:

- The value you put in `authors` in your blog post frontmatter must match this author page’s `title` (case-insensitive). For example:

  ```
  authors: ["Your Name"]
  ```

- Place your image under `public/images/authors/` and reference it with an absolute path like `/images/authors/your-slug.jpg`.
- Supported social keys are: `github`, `linkedin`, `twitter`, `mastodon`, `instagram`, and `bluesky`.

You can see existing author pages here for reference:
https://github.com/pyladies/global-conference/tree/main/src/content/authors

### 2. Header design request (optional)


* **Who:** Communications Lead
* In the same GitHub Pull Request, tag the Design Lead (Georgi) to request the blog post header.
  Include in the comment:
   * Suggested idea
   * Deadline for design delivery

### 3. Review and Merge

* **Who:** Organizers reviewers

* Review the blog post by leaving comments in the Pull Request
* Request edits if needed
* Approve and merge the PR when ready

### 4. Publish & Share

* **Who:** Communications or Social Media Lead

* Confirm the blog post is live on the website
* Share the link in the communications or social media channel
