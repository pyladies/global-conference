---
title: "Sprints Guide"
meta_title: "Sprints Guide"
description: "Guide and Resources for Organizers and assistants"
draft: false
weight: 1
section: "speakers"
---

# Sprints guide for PyLadies Conference 2025

## As conference assistant

### What is a Sprint?

Sprint are informal coding sessions, and knoweldge sharing where people gather
together to work on Open-Source projects, suggest changes in existing libraries
solve problems. A Sprint is an opportunity for learning and self-development
while contributing to Open Source projects.

### How will the sprint work at PyladiesCon?

During the conference, we will conduct mentored Sprint sessions where projects
will be presented. You can then join the specific Discord channel to
coordinate, work on, or ask questions about particular issues.

### What do I need to do to assist in the Sprint?

First, secure your conference ticket, and then attend the mentored Sprint
session. If your timezone prevents participation synchronously, you can still
check out the proposed projects and join the Discord channel.

### When and Where?

The Sprint will take place after the talks and panels:

* TBD: Sunday 7th of December
* TBD: Add time to timezones

### Where can I find the projects in advance?

You can visit [the Sprints page](https://2025.conference.pyladies.com/en/sprints/)
to see all the projects that are already participating.

## As Sprint Organizer

### Open-Source Projects

Anyone can submit a project for the sprints, although sprints are typically
submitted by project maintainers or frequent contributors.

To submit a project for the sprints, you need to submit a Pull-Request
to [this year's conference website repository](https://github.com/pyladies/global-conference-2025),
specifically the
[sprints.astro](https://github.com/pyladies/global-conference-2025/blob/main/src/pages/en/sprints.astro)
file.

And modify the `sprintsData` variable to include your project information,
like it's shown in the following example:

```
const sprintsData = [
{
    name: "Project 1",
    project_url: "https://github.com/myossp/project2",
    project_doc_url: "https://docs.myossproject.com",
    description: "This is an example project that will help you contribute to an OSS initiative!",
    level: "Beginner friendly, some math knowledge",
    languages: "Python, Rust",
  },
];
```

### What worked very well in the past?

Create issue that could be "first time contribution friendly" and assign assign
tags to your issues.

### First time runing a Sprint?

1. Set clear objectives and desired outcomes for the Sprint.
2. Gather all essential materials.
3. Create issues of varying levels (beginner, documentation, etc.) on GitHub to make participation accessible.

Recommended resources:
- https://opensourceevents.github.io/
- http://open-advice.org/




