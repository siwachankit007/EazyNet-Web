# Profiles Migration Guide

## Overview

This guide helps you migrate from the `public.users` table to a new `public.profiles` table with proper foreign key relationships to `auth.users`. This creates a cleaner schema while maintaining all existing functionality.

## Why This Migration?

1. **Proper Foreign Key Relationship**: The new `profiles` table has a proper foreign key to `auth.users(id)`
2. **Cleaner Schema**: Separates user authentication data (in `auth.users`) from application-specific profile data
3. **Better Data Integrity**: CASCADE deletes ensure profile data is removed when auth users are deleted
4. **Automatic Profile Creation**: Triggers automatically create profiles when new users sign up

## Migration Steps

### Step 1: Backup Your Data
Before running any migration, backup your current database:
```sql
-- Create a backup of the current users table
CREATE TABLE users_backup AS SELECT * FROM public.users;
```

### Step 2: Run the Migration
Execute the migration script:
```sql
-- Run the migration script
\i database-migration-profiles.sql
```

### Step 3: Verify the Migration
Check that data was migrated correctly:
```sql
-- Verify profiles table has data
SELECT COUNT(*) FROM public.profiles;

-- Verify the view works
SELECT COUNT(*) FROM public.users;

-- Check a few sample records
SELECT * FROM public.profiles LIMIT 5;
```

### Step 4: Test Your Application
1. Test user signup - should automatically create a profile
2. Test profile updates - should work through the view
3. Test payment webhooks - should update subscription status correctly
4. Test user data fetching - should work as before

## What Changes?

### Database Schema Changes
- **New Table**: `public.profiles` with proper foreign key to `auth.users`
- **View**: `public.users` view that combines profile data with subscription data
- **Triggers**: Automatic profile creation/updates when auth users change
- **RLS Policies**: Proper security policies for the new table

### Application Code Changes
**No immediate code changes required!** The view maintains backward compatibility.

However, you can optionally update your code to use the new `profiles` table directly:

#### Option 1: Keep Using the View (Recommended)
Your existing code will continue to work unchanged. The view provides the same interface as the old table.

#### Option 2: Update Code to Use Profiles Table
If you want to use the new `profiles` table directly:

```typescript
// Old code
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)

// New code
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
```

## Benefits of the New Schema

### 1. Proper Relationships
```sql
-- Old: No foreign key relationship
CREATE TABLE users (id uuid PRIMARY KEY, ...)

-- New: Proper foreign key with CASCADE
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  ...
)
```

### 2. Automatic Profile Management
- Profiles are automatically created when users sign up
- Profiles are automatically updated when auth data changes
- Profiles are automatically deleted when users are deleted

### 3. Better Data Organization
- Authentication data stays in `auth.users`
- Application-specific data goes in `public.profiles`
- Subscription data stays in `public.subscriptions`

### 4. Improved Security
- Proper RLS policies for the profiles table
- Users can only access their own profile data
- Automatic cleanup when users are deleted

## Rollback Plan

If you need to rollback the migration:

1. **Stop your application**
2. **Run the rollback script**:
   ```sql
   \i database-migration-profiles-rollback.sql
   ```
3. **Restart your application**

## Monitoring

After migration, monitor these areas:

1. **User Signup**: Ensure profiles are created automatically
2. **Profile Updates**: Ensure updates work through the view
3. **Payment Webhooks**: Ensure subscription status updates correctly
4. **Performance**: Monitor query performance with the new schema

## Troubleshooting

### Issue: Profile not created on signup
**Solution**: Check that the trigger was created correctly:
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

### Issue: View not returning data
**Solution**: Check RLS policies:
```sql
SELECT * FROM pg_policies WHERE tablename = 'users';
```

### Issue: Performance problems
**Solution**: Check indexes:
```sql
SELECT * FROM pg_indexes WHERE tablename = 'profiles';
```

## Next Steps

After successful migration:

1. **Monitor for 1-2 weeks** to ensure everything works correctly
2. **Consider dropping the view** and updating code to use `profiles` directly
3. **Consider dropping the old users table** if you're confident in the new schema

## Support

If you encounter issues during migration:
1. Check the application logs for errors
2. Verify database triggers and functions exist
3. Test with a small subset of data first
4. Use the rollback script if needed 