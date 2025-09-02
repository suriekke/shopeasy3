# 🔧 Fix Supabase Account Confusion

## Current Situation:
- **Your Email:** `ekkesuri13@gmail.com` (where you want tables)
- **GitHub Account:** Different account (where tables might be)

## Step 1: Check Both Accounts

### Account 1: ekkesuri13@gmail.com
1. **Go to [supabase.com](https://supabase.com)**
2. **Login with:** `ekkesuri13@gmail.com`
3. **Check projects list**
4. **Note:** Any existing projects

### Account 2: GitHub Account
1. **Go to [supabase.com](https://supabase.com)**
2. **Login with GitHub** (different account)
3. **Check projects list**
4. **Note:** Any existing projects with tables

## Step 2: Create Project in Correct Account

### In ekkesuri13@gmail.com Account:
1. **Create New Project**
   - Name: `shopeasy-db`
   - Password: `your-secure-password`
   - Region: Choose closest to your users

2. **Get Credentials**
   - Go to Settings → API
   - Copy:
     - Project URL: `https://your-new-project-id.supabase.co`
     - Anon Key: `your-new-anon-key`

## Step 3: Update Vercel Environment Variables

1. **Go to Vercel Dashboard**
2. **Select your ShopEasy project**
3. **Go to Settings → Environment Variables**
4. **Update these variables:**

```env
VITE_SUPABASE_URL=https://your-new-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-new-anon-key
```

## Step 4: Create Tables in Correct Project

1. **Go to SQL Editor** in your new Supabase project
2. **Copy and paste** the entire content from `customer-app/database-schema.sql`
3. **Run the script**

## Step 5: Add Sample Data

1. **In the same SQL Editor**
2. **Copy and paste** the content from `customer-app/sample-data.sql`
3. **Run the script**

## Step 6: Test Connection

1. **Deploy your app** (Vercel will use new environment variables)
2. **Test the app** to see if it connects to the correct database

## Step 7: Clean Up (Optional)

If you want to delete the old project:
1. **Go to the GitHub-linked account**
2. **Find the old project**
3. **Delete it** (if you don't need it)

## Verification Checklist:

- [ ] Project created in `ekkesuri13@gmail.com` account
- [ ] Environment variables updated in Vercel
- [ ] Database schema created
- [ ] Sample data added
- [ ] App connects to correct database
- [ ] OTP works with Twilio
- [ ] Products display correctly

## Quick Commands:

```bash
# Check current environment variables
echo $VITE_SUPABASE_URL

# Update environment variables (if using local development)
echo "VITE_SUPABASE_URL=https://your-new-project-id.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=your-new-anon-key" >> .env.local
```

## Troubleshooting:

### If tables already exist in wrong account:
1. **Export data** from old project (if needed)
2. **Create new project** in correct account
3. **Import data** to new project

### If environment variables don't update:
1. **Redeploy** your Vercel project
2. **Clear browser cache**
3. **Check deployment logs**

## Next Steps:

1. **Create project** in `ekkesuri13@gmail.com` account
2. **Update Vercel** environment variables
3. **Create tables** in new project
4. **Test everything** works

