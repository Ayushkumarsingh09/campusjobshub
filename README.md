# CampusJobsHub

> India's campus jobs, internships & placement platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-0ea5e9?style=for-the-badge)](https://campusjobshub.com)
[![GitHub](https://img.shields.io/badge/GitHub-campusjobshub-181717?style=for-the-badge&logo=github)](https://github.com/Ayushkumarsingh09/campusjobshub)

**Live website:** [https://campusjobshub.com](https://campusjobshub.com)

Full-stack campus recruitment platform covering jobs, internships, placement prep, and resume AI for Indian students.

## Screenshots

### Homepage

![CampusJobsHub homepage](docs/screenshots/homepage.png)

Live preview: [https://campusjobshub.com](https://campusjobshub.com)

## Highlights

- Campus jobs, internships, and placement preparation for Indian students
- Resume AI and career tooling layered on a modern recruitment UX
- Next.js frontend + Express API + Prisma/Supabase data layer
- Cloudinary media pipeline and GA4 analytics hooks
- Production architecture docs for Hostinger + Render deployment

## Tech Stack

| Layer | Technology |
|-------|------------|
| Core | Next.js 15, Express, Prisma, Supabase, Cloudinary |
| Author | Ayush |
| Homepage | https://campusjobshub.com |

## Quick Start

```bash
# Clone
git clone https://github.com/Ayushkumarsingh09/campusjobshub.git
cd campusjobshub

# Install (Node projects)
npm install

# Develop
npm run dev

# Production build
npm run build
```

For WordPress/PHP packages, skip `npm` and follow the deployment docs in `docs/` / `DEPLOY*.md`.

## Repository Layout

```text
frontend/, backend/, database/, docker/, docs/
README.md
```

## Deployment

1. Configure environment values from `.env.example` when present
2. Build or upload according to the stack above
3. Point DNS to your host
4. Verify production at https://campusjobshub.com

## Author

Built and maintained by **Ayush** ([@Ayushkumarsingh09](https://github.com/Ayushkumarsingh09)).

## License

All rights reserved © CampusJobsHub. Published for portfolio and deployment use.
