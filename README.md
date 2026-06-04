# 📚 Alyssa's Reading Journey

A personal reading journal built with **Next.js 15**, **TypeScript**, and **Tailwind CSS** — deployed as a static site to GitHub Pages.

## Features

- **Home Page** — Hero section, reading stats strip, goal progress, currently reading shelf, and featured quote
- **Books Page** — Filterable/sortable grid by status, genre, and rating
- **Book Detail Page** — Cover, metadata, synopsis, personal review, reading progress
- **Quotes Page** — Masonry layout with filter by book or favorites
- **Statistics Page** — Monthly chart, rating distribution, genre breakdown, reading log

## Tech Stack

- Next.js 15 (App Router, Static Export)
- TypeScript
- Tailwind CSS
- gray-matter (markdown frontmatter parsing)
- remark + remark-html (markdown content rendering)

## Getting Started

```bash
npm install
npm run dev       # localhost:3000
npm run build     # static export → /out
```

## Adding Content

### Add a Book

Create `content/books/your-book-slug.md`:

```markdown
---
title: "Book Title"
author: "Author Name"
cover: "https://url-to-cover-image.jpg"
genre: ["Literary Fiction", "Mystery"]
status: "read"           # read | currently-reading | want-to-read
rating: 4                # 1–5
dateRead: "2024-06-15"
pages: 320
synopsis: "A brief description of the book."
review: "Your personal review."
favorite: true
---

Optional longer notes in markdown here.
```

### Add Quotes

Create `content/quotes/book-name-quotes.md`:

```markdown
---
author: "Author Name"
book: "Book Title"
quotes:
  - text: "The quote text here."
    page: 42
    favorite: true
  - text: "Another quote."
    page: 118
    favorite: false
---
```

## GitHub Pages Deployment

1. Set `NEXT_PUBLIC_BASE_PATH=/your-repo-name` in your environment
2. Run `npm run build`
3. Deploy the `/out` folder to GitHub Pages

Or use GitHub Actions — see `.github/workflows/deploy.yml`.

## Folder Structure

```
alyssas-reading-journey/
├── app/
│   ├── layout.tsx
│   ├── page.tsx            # Home
│   ├── books/
│   │   ├── page.tsx        # Books listing
│   │   └── [slug]/page.tsx # Book detail
│   ├── quotes/page.tsx
│   └── stats/page.tsx
├── components/
│   ├── Nav.tsx
│   ├── BookCard.tsx
│   ├── BooksClient.tsx
│   ├── QuotesClient.tsx
│   ├── GoalProgressBar.tsx
│   └── StarRating.tsx
├── lib/
│   └── books.ts            # Data layer (gray-matter parsing)
└── content/
    ├── books/              # One .md file per book
    └── quotes/             # One .md file per book's quotes
```
