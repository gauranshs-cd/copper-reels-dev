# Git Merge Guide for Copper Flow Studio Team

## Overview
This guide explains how to merge the latest changes from the main branch into your local development environment.

## Prerequisites
- Git installed on your machine
- Access to the copper-flow-studio repository
- Your local repository cloned from: `https://github.com/arvindsarin1/copper-flow-studio`

## Step-by-Step Merge Process

### 1. Check Current Branch Status
First, verify which branch you're currently on:
```bash
git branch
```
The current branch will be marked with an asterisk (*).

### 2. Save Any Uncommitted Work
If you have any uncommitted changes, either commit them or stash them:
```bash
# Option A: Commit your changes
git add .
git commit -m "Your commit message"

# Option B: Stash your changes temporarily
git stash
```

### 3. Switch to Main Branch
Ensure you're on the main branch:
```bash
git checkout main
```

### 4. Fetch Latest Changes from Remote
Get the latest updates from the remote repository without merging:
```bash
git fetch origin
```

### 5. Merge the Latest Changes
Merge the fetched changes into your local main branch:
```bash
git merge origin/main
```

### 6. Push Updated Local Branch (Optional)
If you want to ensure your local changes are pushed:
```bash
git push origin main
```

### 7. Return to Your Feature Branch (If Applicable)
If you were working on a feature branch:
```bash
git checkout your-feature-branch
git merge main
```

## Common Scenarios

### Fast-Forward Merge
If you see "Fast-forward" in the merge output, it means your local branch was behind the remote and Git simply moved your branch pointer forward. No merge commit was needed.

### Merge Conflicts
If you encounter merge conflicts:
1. Git will mark the conflicting files
2. Open each conflicting file and look for conflict markers:
   ```
   <<<<<<< HEAD
   Your local changes
   =======
   Remote changes
   >>>>>>> origin/main
   ```
3. Resolve the conflicts by editing the files
4. After resolving, add and commit the changes:
   ```bash
   git add .
   git commit -m "Resolved merge conflicts"
   ```

## Quick One-Liner
For experienced users, here's a quick command to fetch and merge:
```bash
git pull origin main
```
This combines `git fetch` and `git merge` in one command.

## Best Practices

1. **Always fetch before merging** - This ensures you have the latest remote changes
2. **Commit or stash local changes** - Prevent losing uncommitted work
3. **Review changes after merging** - Use `git log` or `git diff` to understand what was merged
4. **Test after merging** - Run your application to ensure everything works correctly
5. **Communicate with team** - Let others know if you encounter issues or make significant merges

## Troubleshooting

### "Your branch is behind origin/main"
This is normal and means there are new commits on the remote. Follow the merge process above.

### "Permission denied"
Ensure you have proper access to the repository. Contact the repository admin if needed.

### "Merge conflict" 
See the Merge Conflicts section above for resolution steps.

### Want to abort a merge in progress
If you want to cancel a merge that has conflicts:
```bash
git merge --abort
```

## Need Help?
If you encounter issues not covered in this guide:
1. Check the git status: `git status`
2. Review recent commits: `git log --oneline -10`
3. Contact the team lead or repository maintainer

---
*Last updated: August 2025*
*Repository: https://github.com/arvindsarin1/copper-flow-studio*