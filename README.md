# PyLadiesCon Web 2024

Website for the conference based in Hugo.

After installing Hugo, you can serve the page by running:

```
hugo server --buildDrafts
```


## Writing News entries

On the terminal, create a news entry by typing: (Replace ``breaking-news`` with your desired filename).

```
hugo new content content/news/breaking-news.md
```

A new file will be created in the ``/content/news/`` directory with the following front matter set by default.

```
+++
title = 'Breaking News'
date = 2024-08-15T11:01:52-07:00
draft = true
description = ''
image = ''
imagealt = ''
+++
```

Fill in all the fields above.

The frontmatter ``description``, ``image``, ``imagealt`` are used to generate opengraph meta tags. It is important
to fill these in correctly.

If the ``image`` or ``imagealt`` are not set, it defaults to render the PyLadiesCon logo.


