#!/bin/bash

echo "Adding environment variables to Vercel..."

# Add Supabase URL
echo "https://vdfqlbslaoogzfkczosi.supabase.co" | npx vercel env add VITE_SUPABASE_URL production

# Add Supabase Anon Key
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZnFsYnNsYW9vZ3pma2N6b3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MjU2NTksImV4cCI6MjA2NzQwMTY1OX0.PIAfber5EpdzCAZHyKUAZE4SRxzds_OClEfKtc36UG4" | npx vercel env add VITE_SUPABASE_ANON_KEY production

# Add Gemini API Key
echo "AIzaSyCSzrypBYgrdg0MQ9DrcttW7G2-EodiZ1g" | npx vercel env add VITE_GEMINI_API_KEY production

echo "Environment variables added! Now redeploying..."

# Redeploy
npx vercel --prod --yes

echo "Done!"