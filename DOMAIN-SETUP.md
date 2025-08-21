# Domain Setup Instructions

## Current Implementation

### What's Been Done:
1. **Marketing/App Separation**: 
   - Marketing pages (/, /services, /about, etc.) redirect logged-in users to the app
   - App routes (/chat, /dashboard, etc.) are protected and use sidebar navigation
   - Pattern Bank moved to public/marketing pages

2. **Navigation Logic**:
   - No header/navigation shown for logged-in users on marketing pages
   - Sidebar only shown for logged-in users on app routes
   - Clean separation between marketing and app experiences

3. **Redirect System**:
   - `MarketingRedirect` component handles automatic redirects
   - Logged-in users visiting marketing pages are redirected to /chat
   - Configuration ready for subdomain separation

## DNS Setup Required

To complete the app.copperreels.com setup, you need to:

### 1. Add DNS Records in Your Domain Registrar:

```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
TTL: Auto/3600

Type: CNAME  
Name: app.dev
Value: cname.vercel-dns.com
TTL: Auto/3600
```

### 2. After DNS Propagation (5-30 minutes):

Run these commands to set up the aliases:

```bash
# For production app subdomain
npx vercel alias set [deployment-url] app.copperreels.com

# For dev app subdomain
npx vercel alias set [deployment-url] app.dev.copperreels.com
```

### 3. Update Code for Subdomain Redirects:

Once subdomains are working, update `MarketingRedirect.tsx`:

```typescript
// Change from:
navigate('/chat');

// To:
redirectToApp(); // This will redirect to app.copperreels.com
```

## Current Behavior

### For Non-Logged-In Users:
- Can access all marketing pages with full navigation
- Pattern Bank is publicly accessible
- Sign up/Login flows work normally

### For Logged-In Users:
- Marketing pages redirect to /chat automatically
- App pages show sidebar navigation
- No header shown on any page (sidebar handles navigation)
- Floating "Next" button on pages with sidebar

## Testing on Dev

The current implementation is live on `dev.copperreels.com`:
- Marketing pages will redirect logged-in users
- App navigation uses sidebar only
- Pattern Bank is public

## Future Enhancements

Once DNS is configured:
1. `copperreels.com` - Marketing site only
2. `app.copperreels.com` - Application only
3. Complete separation of concerns
4. Better SEO for marketing pages
5. Cleaner URLs for app users