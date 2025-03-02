# Supabase Local Development Guide

This guide provides detailed instructions for working with Supabase in your local development environment for the NaijaHub project.

## Overview

Supabase is an open-source Firebase alternative that provides a PostgreSQL database, authentication, instant APIs, real-time subscriptions, and storage. For NaijaHub, we use Supabase as our backend service.

## Prerequisites

Before you begin, ensure you have:

- Docker installed and running
- Supabase CLI installed (`npm install -g supabase`)
- NaijaHub repository cloned locally

## Initial Setup

### Step 1: Start Supabase Locally

Navigate to your project directory and start Supabase:

```bash
cd naijahub
supabase start
```

This command will:
- Start a PostgreSQL database
- Start the Supabase services (Auth, Storage, Functions, etc.)
- Apply existing migrations
- Generate API keys

The output will look something like this:

```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Take note of these URLs and keys, as you'll need them for your environment variables.

### Step 2: Update Environment Variables

Update your `.env` file with the Supabase URLs and keys:

```
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-anon-key-from-output
```

## Working with Migrations

Migrations are SQL scripts that define your database schema and are stored in the `supabase/migrations` directory.

### Viewing Current Migrations

List all existing migrations:

```bash
ls -la supabase/migrations
```

### Creating a New Migration

To create a new migration:

```bash
supabase migration new your_migration_name
```

This creates a new timestamped SQL file in the `supabase/migrations` directory.

### Writing Migrations

Open the newly created migration file and add your SQL commands:

```sql
-- Example migration
CREATE TABLE IF NOT EXISTS public.new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all new_table entries" ON public.new_table
  FOR SELECT USING (true);
```

### Applying Migrations

To apply all migrations:

```bash
supabase db reset
```

This will reset your database and apply all migrations in order.

### Migration Best Practices

1. **Idempotent Migrations**: Use `IF NOT EXISTS` and `IF EXISTS` clauses to make migrations rerunnable.
2. **One Change Per Migration**: Each migration should represent a single logical change.
3. **Never Modify Existing Migrations**: Once a migration is committed, create a new migration for changes.
4. **Include RLS Policies**: Always include Row Level Security policies in your migrations.
5. **Add Indexes**: Include appropriate indexes for performance.

## Using Supabase Studio

Supabase Studio provides a visual interface for managing your database.

### Accessing Studio

Open your browser and navigate to:

```
http://localhost:54323
```

### Key Features in Studio

1. **Table Editor**: Create and modify tables visually
2. **SQL Editor**: Run SQL queries directly
3. **Authentication**: Manage users and authentication settings
4. **Storage**: Manage file storage
5. **Edge Functions**: Deploy and test serverless functions

## Row Level Security (RLS)

NaijaHub uses Row Level Security extensively to secure data access.

### Basic RLS Pattern

```sql
-- Enable RLS on a table
ALTER TABLE public.your_table ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all entries" ON public.your_table
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own entries" ON public.your_table
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" ON public.your_table
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" ON public.your_table
  FOR DELETE USING (auth.uid() = user_id);
```

## Real-time Subscriptions

NaijaHub uses Supabase's real-time features for live updates.

### Enabling Real-time for a Table

In your migration:

```sql
-- Enable real-time for a table
ALTER PUBLICATION supabase_realtime ADD TABLE public.your_table;
```

## Database Functions

Custom PostgreSQL functions can be defined in migrations.

### Example Function

```sql
CREATE OR REPLACE FUNCTION get_user_posts(user_uuid UUID)
RETURNS SETOF posts AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.posts
  WHERE user_id = user_uuid
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;
```

## Common Issues and Troubleshooting

### Migration Conflicts

If you encounter migration conflicts:

1. Run `supabase db reset --no-backup` to reset completely
2. If issues persist, delete the `.supabase` directory and run `supabase start` again

### Connection Issues

If you can't connect to Supabase:

1. Ensure Docker is running
2. Check container status with `docker ps`
3. Restart Supabase with `supabase stop` followed by `supabase start`

### Database Reset Without Losing Data

To apply new migrations without losing data:

```bash
supabase db dump -f db_backup.sql
supabase db reset
psql postgresql://postgres:postgres@localhost:54322/postgres -f db_backup.sql
```

## Advanced Topics

### Custom Types and Enums

```sql
-- Create an enum type
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'user');

-- Use in a table
ALTER TABLE public.profiles ADD COLUMN role user_role DEFAULT 'user';
```

### Full-Text Search

```sql
-- Add full-text search to a table
ALTER TABLE public.posts ADD COLUMN search_vector tsvector;

-- Create a function to update the search vector
CREATE OR REPLACE FUNCTION update_post_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = to_tsvector('english', NEW.title || ' ' || NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the search vector
CREATE TRIGGER update_post_search_vector_trigger
BEFORE INSERT OR UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION update_post_search_vector();

-- Create an index for the search vector
CREATE INDEX posts_search_vector_idx ON public.posts USING gin(search_vector);
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
