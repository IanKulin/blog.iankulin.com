# blog.iankulin.com

Hugo static site for [blog.iankulin.com](https://blog.iankulin.com). Theme: [hugo-theme-console](https://github.com/mrmierzejewski/hugo-theme-console).

## Development

Start the local dev server with live reload:

```bash
hugo server
```

The site will be available at <http://localhost:1313>. Hugo watches for file changes and refreshes the browser automatically.

To preview draft posts:

```bash
hugo server --buildDrafts
```

## Posting

Create a new file in `content/posts/` named after the post slug, e.g. `content/posts/my-post-title.md`.

Every post needs YAML frontmatter at the top:

```yaml
---
title: "My Post Title"
date: "2025-05-15"
slug: my-post-title
draft: true
tags:
  - ios-dev
---
```

Fields:

| Field     | Required | Notes                                                                                            |
| --------- | -------- | ------------------------------------------------------------------------------------------------ |
| `title`   | Yes      | Display title; wrap in double quotes and escape internal `"` as `\"`                             |
| `date`    | Yes      | ISO date string, e.g. `'2025-05-15'`                                                             |
| `slug`    | Yes      | URL path segment; match the filename                                                             |
| `tags`    | Yes      | Lowercase, hyphenated                                                                            |
| `draft`   | No       | Set `true` until ready to publish, then remove                                                   |
| `aliases` | No       | Old URLs to redirect here — used for migrated WordPress posts, e.g. `/2022/09/21/my-post-title/` |

Images go in `static/images/` and are referenced in the post body as `/images/filename.jpg`.

Preview drafts locally with `hugo server --buildDrafts`.

## Template changes

Deviations from hugo-theme-console defaults, grouped by location.

### `hugo.toml`

| Setting                           | Value                  | Theme default               |
| --------------------------------- | ---------------------- | --------------------------- |
| `params.navlinks`                 | about/, posts/, tags/, | none                        |
| `taxonomies`                      | tags only              | tags + categories           |
| `pagination.pagerSize`            | 20                     | 10                          |
| `permalinks.posts`                | `/:slug/`              | `/:year/:month/:day/:slug/` |
| `markup.goldmark.renderer.unsafe` | `true`                 | `false`                     |

### Layout overrides (`layouts/`)

- **`index.html`** — Custom homepage: shows site title, description, and the 10 most recent posts.
- **`_default/list.html`** — Custom paginated post list sorted by date descending with `Jan. 2, 2006` date format; respects a `private` front matter flag to hide posts from listings.

### Archetype (`archetypes/default.md`)

- Generates YAML frontmatter with `title`, `date`, `slug`, `draft: true`, and empty `tags`.
- Auto-generates `title` from the filename (hyphens → spaces, title-cased).

## Deployment

The Docker image is published to `ghcr.io/iankulin/blog.iankulin.com`.

### Building and pushing the image

```bash
# One-shot: build for AMD64 and push to GHCR
docker buildx build --builder multiarch-builder --platform linux/amd64 \
  -t ghcr.io/iankulin/blog.iankulin.com:latest \
  --push .
```

### Running locally

Build and start with the production URL (uses your native platform):

```bash
docker compose up -d --build
```

To test with a local URL (links will resolve to `localhost:8080`):

```bash
docker build --build-arg BASE_URL=http://localhost:8080 -t blog-local .
docker run -p 8080:80 blog-local
```

### One-off Hugo build (no Docker)

Output goes to `public/`:

```bash
hugo --minify
```
