# CampusJobsHub

India's campus jobs, internships & placement platform

**Live:** [https://campusjobshub.com](https://campusjobshub.com)  
**Repository:** https://github.com/Ayushkumarsingh09/campusjobshub

Full-stack campus recruitment platform covering jobs, internships, placement prep, and resume AI for Indian students.


## Screenshots

### Homepage

![CampusJobsHub screenshot](docs/screenshots/homepage.png)

> Captured from the live project UI.

## Features

- Rich educational / editorial content collection
- SEO foundations: metadata, sitemap/robots, and share cards
- Production-ready configuration for static or Node hosting
- Live deployment target: [campusjobshub.com](https://campusjobshub.com)

## Tech Stack

- Next.js 15
- Express
- Prisma
- Supabase
- Cloudinary

## Quick Start

```bash
# Install dependencies (if package.json is present)
npm install

# Start local development
npm run dev
```

> Some projects are PHP/WordPress packages — follow their deployment docs in `docs/` or `DEPLOY*.md` instead of `npm run dev`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run lint` | Lint source (when configured) |

## Project Structure

```text
.
├── src/ or app source        # Application code
├── public/ or assets/        # Static assets
├── docs/                     # Deployment & operations notes
├── scripts/                  # Maintenance / content generators
└── README.md                 # You are here
```

## Deployment

This project is prepared for production hosting (Hostinger / Vercel / static export / PHP hosting depending on stack).

1. Configure environment variables from `.env.example` (when present)
2. Build or upload according to the project stack
3. Point the domain to the hosting target
4. Verify the live URL: https://campusjobshub.com

## Author

**Ayush**  
GitHub: [Ayushkumarsingh09](https://github.com/Ayushkumarsingh09)

## License

All rights reserved © CampusJobsHub. Source is published for portfolio and deployment use unless otherwise noted.
