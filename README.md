# Creative Asset Manager

A Creative Cloud-style asset management app for design teams. Built as a demo project for showcasing Cursor IDE features.

## Quick Start

```bash
npm install
npm run seed    # Populate with sample Adobe-themed assets
npm run dev     # Start both API server and React client
```

## Architecture

- **Frontend:** React with custom hooks and functional components
- **API:** Express with RESTful routes
- **Database:** SQLite via better-sqlite3
- **Cursor Rules:** `.cursor/rules` enforces Adobe-style coding standards

## Demo Features

This project is designed to demonstrate:
1. **Rules files** — `.cursor/rules` with team coding standards
2. **@codebase queries** — Multi-file architecture for cross-file context
3. **Agent mode** — Realistic tasks spanning multiple files
4. **Model selection** — Various task complexities for different models
