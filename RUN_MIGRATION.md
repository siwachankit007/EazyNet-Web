# 🗄️ Database Migration - Step by Step

## 🚨 **Error: Subscriptions Table Not Found**

You're getting a 406 error because the `subscriptions` table doesn't exist yet. Let's fix this:

## 📋 **Step 1: Run Database Migration**

### **Option A: Using Supabase Dashboard (Recommended)**

1. **Go to Supabase Dashboard**
   - Open [supabase.com](https://supabase.com)
   - Sign in to your account
   - Select your EazyNet project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration**
   - Copy and paste the entire content from the database migration script
   - Click "Run" to execute the SQL

### **Option B: Using Supabase CLI**

```bash
# If you have Supabase CLI installed
supabase db push
```

## 🔍 **Step 2: Verify Migration**

After running the migration, verify it worked by checking:

1. **Check if table exists**
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'subscriptions';
   ```

2. **Check if policies exist**
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'subscriptions';
   ```

## 🎯 **Step 3: Test Again**

After running the migration:

1. **Refresh your browser** (http://localhost:3002)
2. **Go to Profile page** - should work now
3. **Test payment flows** - should work now

## 🚨 **If You Still Get Errors**

### **Error 1: "relation does not exist"**
- The migration didn't run successfully
- Check Supabase dashboard for any SQL errors
- Re-run the migration

### **Error 2: "permission denied"**
- RLS policies might not be set up correctly
- Check if the policies were created
- Re-run the migration

### **Error 3: "function does not exist"**
- The trigger function wasn't created
- Re-run the migration

## 📞 **Need Help?**

If you're still having issues:

1. **Check Supabase Dashboard**
   - Go to Database > Tables
   - Look for `subscriptions` table
   - Check if it exists and has the right structure

2. **Check SQL Editor**
   - Look for any error messages
   - Re-run the migration if needed

3. **Contact Support**
   - Check Supabase documentation
   - Or ask for help in the community

## 🎉 **After Migration**

Once the migration is successful:

- ✅ `subscriptions` table will exist
- ✅ RLS policies will be active
- ✅ Your payment system will work
- ✅ You can test all payment flows

**Run the migration and let me know if you need help!** 🚀 