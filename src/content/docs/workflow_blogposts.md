---
title: "Workflow: Blog posts"
meta_title: "Workflow: Blog posts"
description: "Workflow for requesting and submiting a blog post"
draft: false
---

## Request Blog Post Workflow

**For the communications team**

### 1. Blog Post Request Initiation

* **Who:** Any team member
* **Where:** GitHub ([PyLadiesCon repo](https://github.com/global-conference] – Pull request)

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
