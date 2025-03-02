# Deploying NaijaHub to Vercel

This guide walks through the process of deploying NaijaHub to Vercel for beta testing and production.

## Prerequisites

Before deploying, ensure you have:

1. A [Vercel account](https://vercel.com/signup)
2. A [Supabase account](https://app.supabase.io/) (for production database)
3. The [Vercel CLI](https://vercel.com/cli) installed (optional, but recommended)
4. Git repository with your NaijaHub code

## Environment Setup

### 1. Production Supabase Setup

Before deploying to Vercel, you need to set up a production Supabase project:

1. Log in to [Supabase](https://app.supabase.io/)
2. Create a new project
3. Note your project's URL and anon key
4. Apply migrations to your production database:
   ```bash
   supabase link --project-ref your-project-ref
   supabase db push
   ```

### 2. Environment Variables

You'll need to set up the following environment variables in Vercel:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abcdefghijklm.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_APP_URL` | Your deployed app URL | `https://naijahub.vercel.app` |

## Deployment Methods

### Method 1: Vercel Dashboard (Recommended for First Deployment)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your Git repository
5. Configure project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables (from the list above)
7. Click "Deploy"

### Method 2: Vercel CLI

1. Install Vercel CLI if you haven't already:
   ```bash
   npm i -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   cd /path/to/naijahub
   vercel
   ```

4. Follow the prompts to configure your project
5. Set environment variables when prompted or add them later in the Vercel dashboard

### Method 3: GitHub Integration with Automatic Deployments

1. Connect your GitHub repository to Vercel
2. Configure automatic deployments:
   - Main branch for production
   - Preview deployments for pull requests
3. Set up environment variables in the Vercel project settings

## Beta Testing Configuration

### 1. Password Protection

For closed beta testing, we're using Vercel's built-in password protection feature:

1. After deploying your project to Vercel:
   - Go to your project in the Vercel dashboard
   - Navigate to Settings > Password Protection
   - Enable password protection
   - Set your desired username and password
   - Save the settings

2. Share these credentials with your beta testers

### 2. Setting Up Beta Testing Domains

You can create a specific subdomain for beta testing:

1. In Vercel dashboard, go to your project
2. Navigate to Settings > Domains
3. Add a domain like `beta.naijahub.com`
4. Configure DNS settings as instructed

### 3. Inviting Beta Testers

1. Create a simple email template to invite beta testers:
   ```
   Subject: You're invited to test NaijaHub Beta!
   
   Hi [Name],
   
   You've been selected to participate in the NaijaHub beta testing program!
   
   Access the beta at: https://beta.naijahub.com
   
   Login credentials:
   Username: [BETA_USERNAME]
   Password: [BETA_PASSWORD]
   
   Your feedback is valuable to us. Please report any issues or suggestions through the feedback form in the app.
   
   Thank you for helping us improve NaijaHub!
   
   The NaijaHub Team
   ```

## Monitoring Your Deployment

### 1. Vercel Analytics

1. In Vercel dashboard, go to your project
2. Navigate to Analytics
3. Monitor performance, usage, and errors

### 2. Error Tracking

1. Set up error tracking with Sentry or similar service
2. Add the integration to your Vercel project

### 3. User Feedback Collection

1. Implement a feedback form in your app
2. Store feedback in Supabase
3. Set up notifications for new feedback

## Deployment Checklist

Before deploying to beta, ensure:

- [ ] All environment variables are configured
- [ ] Database migrations are applied to production
- [ ] Authentication is properly configured
- [ ] Storage buckets are set up
- [ ] Error monitoring is in place
- [ ] Feedback collection mechanism exists
- [ ] Beta tester invitation system is ready
- [ ] Privacy policy and terms of service are in place

## Troubleshooting Common Issues

### Build Failures

If your build fails, check:
- Correct Node.js version in `package.json` engines field
- All dependencies are properly installed
- No environment variables are missing

### Database Connection Issues

If you're having trouble connecting to Supabase:
- Verify environment variables are correct
- Check that your IP is allowed in Supabase dashboard
- Ensure RLS policies are properly configured

### Routing Issues

If routes aren't working properly:
- Check the `vercel.json` configuration
- Ensure your React Router configuration works with client-side routing

## Next Steps After Beta

1. Collect and analyze feedback
2. Fix critical issues
3. Implement high-priority feature requests
4. Plan for public launch
5. Scale database resources as needed

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
