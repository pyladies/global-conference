# PyLadiesCon website

This repository contains the content for the main PyLadiesCon website
that serve as an index for the many resources that the conference has;
including the blog, the documentation, and static website for each year.

## Services Overview

The following diagram shows how the PyLadiesCon services interact with each other and with external services like Pretalx, Discord, and YouTube.

![Infrastructure Overview](INFRASTRUCTURE_DIAGRAM.md)

## Development

First install [pnpm](https://pnpm.io/installation) if you don't have it already.

Then install the dependencies and start the development server:

```
pnpm install
pnpm dev
```

## Theme

This is a modification of the [Bookworm Light
astro](https://github.com/themefisher/bookworm-light-astro) theme.
