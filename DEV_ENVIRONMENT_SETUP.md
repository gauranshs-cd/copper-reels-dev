# 🚀 Development Environment Setup
**Date:** January 21, 2025  
**Purpose:** Set up dev.copperreels.com for testing before production deployment

---

## 📌 CURRENT STATUS: WAITING FOR DNS SETUP

### ✅ What's Already Done:
1. Created `development` branch in GitHub
2. Deployed to Vercel: `https://copper-flow-studio-3r0tfgys9-arvind-sarins-projects.vercel.app`
3. Configured Vercel for automatic deployments
4. Environment variables are shared (same database)

### ⚠️ ACTION REQUIRED: GoDaddy DNS Setup

## 🔧 DNS Configuration for GoDaddy

**Please add these DNS records in GoDaddy:**

### Option 1: CNAME Record (Recommended)
```
Type: CNAME
Name: dev
Value: cname.vercel-dns.com
TTL: 600 (or default)
```

### Option 2: A Record (Alternative)
```
Type: A
Name: dev
Value: 76.76.21.21
TTL: 600 (or default)
```

**Steps in GoDaddy:**
1. Log in to GoDaddy account
2. Go to "My Products" → "Domains"
3. Find `copperreels.com` → Click "Manage"
4. Go to "DNS" or "Manage Zones"
5. Click "Add" or "Add Record"
6. Add the CNAME record as shown above
7. Save changes

**Note:** DNS propagation can take 5-30 minutes.

---

## 🔄 After DNS is Configured

Once you've added the DNS record, run this command:

```bash
cd "/Users/arvindsarin/Cursor/Claude/AI-Powered YouTube Content Creation System /copper-flow-studio"
npx vercel alias set copper-flow-studio-3r0tfgys9-arvind-sarins-projects.vercel.app dev.copperreels.com
```

This will connect dev.copperreels.com to our development deployment.

---

## 📊 Environment Architecture

### Production (copperreels.com)
- **Branch:** `main`
- **URL:** https://copperreels.com
- **Purpose:** Live customer-facing site
- **Deploy:** Automatic on push to `main`

### Development (dev.copperreels.com)
- **Branch:** `development`
- **URL:** https://dev.copperreels.com (pending DNS)
- **Current:** https://copper-flow-studio-3r0tfgys9-arvind-sarins-projects.vercel.app
- **Purpose:** Testing before production
- **Deploy:** Automatic on push to `development`

### Database & Auth
- **SHARED DATABASE:** Both environments use the same Supabase instance
- **Same Login:** Users can log in to both dev and production with same credentials
- **Data Sync:** All data is shared between environments

---

## 👥 Team Workflow

### For Developers:

#### 1. Working on New Features
```bash
# Start from development branch
git checkout development
git pull origin development

# Create feature branch
git checkout -b feature/your-feature

# Make changes, then push
git add .
git commit -m "Your changes"
git push origin feature/your-feature

# Create PR to development branch (not main!)
```

#### 2. Testing on Dev Environment
```bash
# Merge feature to development
git checkout development
git merge feature/your-feature
git push origin development

# Automatic deploy to dev.copperreels.com
# Test your changes there
```

#### 3. Deploying to Production
```bash
# After testing on dev is successful
git checkout main
git merge development
git push origin main

# Automatic deploy to copperreels.com
```

---

## 🔑 Environment Variables

Both environments share the same:
- `VITE_SUPABASE_URL` - Same database
- `VITE_SUPABASE_ANON_KEY` - Same auth
- `VITE_GEMINI_API_KEY` - Same AI API

**No separate logins needed!**

---

## 📝 Deployment Commands

### Deploy to Development
```bash
git checkout development
git push origin development
# Automatically deploys to dev.copperreels.com
```

### Deploy to Production
```bash
git checkout main
git merge development
git push origin main
# Automatically deploys to copperreels.com
```

### Manual Deploy (if needed)
```bash
# For dev
npx vercel --prod

# For production
git checkout main
npx vercel --prod
```

---

## 🔍 Monitoring Deployments

### View All Deployments
```bash
npx vercel ls
```

### View Logs
```bash
npx vercel logs [deployment-url]
```

### Check Domain Status
```bash
npx vercel domains ls
```

---

## ⚠️ Important Notes

1. **Always test on dev first** before pushing to production
2. **Database is shared** - be careful with destructive operations
3. **API keys are shared** - rate limits apply to both environments
4. **Branch Protection** - Consider adding branch protection rules on GitHub

---

## 🚨 Troubleshooting

### If dev.copperreels.com doesn't work:
1. Check DNS propagation: https://dnschecker.org
2. Verify CNAME record in GoDaddy
3. Re-run the alias command
4. Check Vercel dashboard for errors

### If deployment fails:
1. Check build logs: `npx vercel logs`
2. Verify environment variables: `npx vercel env ls`
3. Check branch settings in vercel.json

---

## 📞 Support

**Issues?** Contact Arvind:
- WhatsApp: +1 469-742-0195
- Email: arvind@copperreels.com

---

**Next Step:** Add the DNS record in GoDaddy, then let me know!