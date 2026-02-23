# inkwell

A personal writing blog built with Next.js, Neon PostgreSQL, and Tailwind CSS. Designed for Vercel deployment.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

Create a Neon PostgreSQL database and run the following SQL:

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url VARCHAR(500),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

### 3. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
cp .env.local.example .env.local
```

- **DATABASE_URL** — Neon connection string
- **BLOB_READ_WRITE_TOKEN** — Vercel Blob token (auto-set when linked)
- **ADMIN_PASSWORD** — bcrypt hash of your admin password:
  ```bash
  node -e "require('bcryptjs').hash('yourpassword', 10).then(console.log)"
  ```
- **SESSION_SECRET** — Random string (min 32 chars):
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### 4. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Add the Neon and Blob integrations (they auto-set `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN`)
4. Set `ADMIN_PASSWORD` and `SESSION_SECRET` in Vercel environment variables
5. Deploy
