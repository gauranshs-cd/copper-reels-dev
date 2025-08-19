# Deployment Instructions for copperreels.com

## Prerequisites
- Vercel account (sign up at vercel.com)
- Squarespace domain (copperreels.com)
- GitHub account (for continuous deployment)

## Step 1: Push to GitHub
```bash
cd "/Users/arvindsarin/Cursor/Claude/AI-Powered YouTube Content Creation System /copper-flow-studio"
git init
git add .
git commit -m "Initial deployment to copperreels.com"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: **Vite**
   - Root Directory: **./** (leave as is)
   - Build Command: **npm run build** (auto-detected)
   - Output Directory: **dist** (auto-detected)
   - Install Command: **npm install** (auto-detected)

5. Add Environment Variables in Vercel:
   Click "Environment Variables" and add:
   ```
   VITE_SUPABASE_URL = https://vdfqlbslaoogzfkczosi.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZnFsYnNsYW9vZ3pma2N6b3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MjU2NTksImV4cCI6MjA2NzQwMTY1OX0.PIAfber5EpdzCAZHyKUAZE4SRxzds_OClEfKtc36UG4
   VITE_GEMINI_API_KEY = AIzaSyCSzrypBYgrdg0MQ9DrcttW7G2-EodiZ1g
   ```

6. Click "Deploy"

## Step 3: Configure Custom Domain

### In Vercel:
1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add domain: **copperreels.com**
4. Add domain: **www.copperreels.com** (redirect to copperreels.com)
5. Vercel will show you DNS records to add

### In Squarespace:
1. Go to your Squarespace account
2. Navigate to: **Settings** → **Domains** → **copperreels.com**
3. Click on **DNS Settings**
4. Remove any existing A records pointing to Squarespace
5. Add the following DNS records:

#### For root domain (copperreels.com):
- **Type:** A
- **Host:** @
- **Value:** 76.76.21.21
- **TTL:** 3600

#### For www subdomain:
- **Type:** CNAME
- **Host:** www
- **Value:** cname.vercel-dns.com
- **TTL:** 3600

## Step 4: Verify Deployment

1. Wait 5-30 minutes for DNS propagation
2. Visit https://copperreels.com
3. Test user registration/login
4. Verify all features work

## Step 5: Set up SSL (Automatic)

Vercel automatically provisions SSL certificates. Once DNS is configured, your site will be available at:
- https://copperreels.com
- https://www.copperreels.com (redirects to main)

## Continuous Deployment

Any push to the main branch will automatically deploy to production:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

## Production Environment Variables

Make sure these are set in Vercel dashboard:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_GEMINI_API_KEY` - Your Google Gemini API key

## Monitoring

- Check deployment status: https://vercel.com/dashboard
- View logs: Project → Functions → Logs
- Analytics: Project → Analytics

## Troubleshooting

If DNS doesn't work after 30 minutes:
1. Check DNS propagation: https://dnschecker.org
2. Verify records in Squarespace
3. In Vercel, remove and re-add the domain
4. Contact Vercel support if issues persist

## Support
- Vercel Docs: https://vercel.com/docs
- Squarespace DNS: https://support.squarespace.com/hc/en-us/articles/360002101888