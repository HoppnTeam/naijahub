# NaijaHub Beta Deployment Guide

This is a simplified step-by-step guide to deploy the NaijaHub beta to Vercel.

## Step 1: Push Your Code to GitHub

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for beta deployment"
git push origin main
```

## Step 2: Set Up Supabase Production Project

1. Log in to [Supabase](https://app.supabase.io/)
2. Create a new project
3. Note your project URL and anon key
4. Apply migrations to your production database:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_APP_URL` | Your deployed app URL |
| `VITE_APP_ENV` | `production` |
| `VITE_ENABLE_ANALYTICS` | `true` |
| `VITE_ENABLE_ERROR_REPORTING` | `true` |

6. Click "Deploy"

### Option B: Using Vercel CLI

1. Install Vercel CLI if you haven't already:
```bash
npm i -g vercel
```

2. Log in to Vercel:
```bash
vercel login
```

3. Create a `.env.production` file based on the example:
```bash
cp .env.production.example .env.production
# Edit the file with your actual values
```

4. Deploy from your project directory:
```bash
vercel --prod
```

## Step 4: Set Up Password Protection for Beta

After your initial deployment is complete:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Password Protection
3. Enable password protection
4. Set your desired username and password
5. Save the settings

This will add password protection to your beta site without requiring any code changes.

## Step 5: Verify Your Deployment

1. Once deployment is complete, Vercel will provide a URL
2. Visit the URL and verify that:
   - Password protection is working
   - The application loads correctly
   - The beta banner appears
   - The feedback form is accessible

## Step 6: Invite Beta Testers

1. Create an email template to invite beta testers with:
   - The beta URL
   - Login credentials (username/password)
   - Instructions for providing feedback
   - Expected beta testing period

2. Send invitations to your selected beta testers

## Step 7: Monitor Feedback and Usage

1. Check the Supabase dashboard for new feedback submissions
2. Monitor Vercel analytics for usage patterns
3. Address critical issues promptly

## Troubleshooting

If you encounter issues with your deployment:

1. Check Vercel build logs for errors
2. Verify environment variables are correctly set
3. Ensure Supabase connection is working
4. Check that all routes are properly configured

For more detailed instructions, refer to the full deployment guide in `docs/guides/deployment.md`.
