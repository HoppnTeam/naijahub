# Setting Up Your Development Environment

This guide will walk you through the process of setting up your local development environment for the NaijaHub project.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or later)
- **npm** (v8 or later)
- **Git**
- **Docker** (for local Supabase development)
- **Supabase CLI**

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-organization/naijahub.git
cd naijahub
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Set Up Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update the environment variables in the `.env` file with your local configuration.

Key environment variables include:

```
# Supabase Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-anon-key

# Application Configuration
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:5173/api
```

## Step 4: Set Up Local Supabase

1. Install the Supabase CLI if you haven't already:

```bash
npm install -g supabase
```

2. Start the local Supabase services:

```bash
supabase start
```

This will start a local Supabase instance with all necessary services (PostgreSQL, Auth, Storage, etc.).

3. Apply migrations to set up the database schema:

```bash
supabase db reset
```

This command will apply all migrations in the `supabase/migrations` directory.

## Step 5: Start the Development Server

```bash
npm run dev
```

This will start the Vite development server, typically at http://localhost:5173.

## Step 6: Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

You should now see the NaijaHub application running locally.

## Additional Configuration

### Setting Up Authentication

For local development, you can use the Supabase Studio to manage authentication:

1. Open the Supabase Studio:

```
http://localhost:54323
```

2. Navigate to the "Authentication" section to configure authentication providers.

### Working with Database Migrations

To create a new migration:

```bash
supabase migration new your_migration_name
```

This will create a new migration file in the `supabase/migrations` directory.

To apply migrations:

```bash
supabase db reset
```

### Seeding Test Data

To seed the database with test data:

```bash
npm run seed
```

This script will populate your local database with sample data for development.

## Troubleshooting

### Common Issues

#### Supabase Connection Issues

If you're having trouble connecting to your local Supabase instance:

1. Ensure Docker is running
2. Check that the Supabase services are up with `supabase status`
3. Verify your environment variables match the output from `supabase status`

#### Node.js Version Conflicts

If you encounter Node.js version conflicts, consider using a version manager like `nvm`:

```bash
nvm install 18
nvm use 18
```

#### Port Conflicts

If you encounter port conflicts, you can modify the ports in your `.env` file and restart the services.

## Next Steps

Now that your development environment is set up, you can:

- Explore the [API Documentation](../api/README.md)
- Learn about the [Database Schema](../schema/README.md)
- Check out the [Contributing Guidelines](./contributing.md)

Happy coding!
