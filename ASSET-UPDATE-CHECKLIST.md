# Asset Update Checklist

## When Updating Logos or Brand Assets

### 1. Pre-Update Search
- [ ] Run comprehensive search: `grep -r "old-asset-name" src/ public/`
- [ ] Check ALL page components, not just common components
- [ ] Search for partial matches (e.g., "copper", "logo", etc.)

### 2. Update Central Configuration
- [ ] Update `/src/config/assets.ts` with new asset paths
- [ ] Mark old assets as deprecated in the config

### 3. Component Updates
- [ ] AppHeader (`/src/components/AppHeader.tsx`)
- [ ] Footer (`/src/components/Footer.tsx`)
- [ ] Sidebar (`/src/components/navigation/Sidebar.tsx`)
- [ ] All page components in `/src/pages/`
  - [ ] Index.tsx
  - [ ] Index-new.tsx
  - [ ] ChatInterface.tsx
  - [ ] Any other pages

### 4. Verification
- [ ] Run local dev server and check all pages
- [ ] Check both authenticated and non-authenticated views
- [ ] Verify mobile and desktop views

### 5. Deployment
- [ ] Deploy to dev server first
- [ ] Verify on dev.copperreels.com
- [ ] Document the change in commit message

## Best Practices

1. **Use centralized configuration**: Always reference assets from `/src/config/assets.ts`
2. **Search comprehensively**: Use `grep -r` to find ALL references
3. **Test all routes**: Don't assume - actually navigate to each page
4. **Version control**: Keep old assets in public folder temporarily for rollback

## Common Pitfalls to Avoid

- Don't update only "obvious" files - search everything
- Don't forget about less-used pages or admin pages
- Don't assume one search pattern will find everything
- Don't skip testing on actual deployed environment