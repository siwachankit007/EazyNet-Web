-- Migration to rename users table to profiles and restructure with proper foreign keys
-- This maintains all existing data while creating a cleaner schema

-- Step 1: Create the new profiles table with proper foreign key
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{}'::jsonb,
    login_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Copy data from existing users table to new profiles table
INSERT INTO public.profiles (
    id, email, name, avatar_url, bio, phone, 
    updated_at, preferences, login_datetime, created_at
)
SELECT 
    id, email, name, avatar_url, bio, phone,
    updated_at, preferences, logindatetime, created_at
FROM public.users
ON CONFLICT (id) DO NOTHING;

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles(updated_at);

-- Step 4: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profiles_updated_at();

-- Step 6: Add RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete own profile" ON profiles
    FOR DELETE USING (auth.uid() = id);

-- Step 7: Create a view for backward compatibility (optional, for transition period)
CREATE OR REPLACE VIEW public.users AS
SELECT 
    p.id,
    p.email,
    p.name,
    p.avatar_url,
    p.bio,
    p.phone,
    p.updated_at,
    p.preferences,
    p.login_datetime as logindatetime,
    p.created_at,
    -- Add subscription-related fields from subscriptions table
    COALESCE(s.is_trial, false) as istrial,
    CASE 
        WHEN s.status = 'active' AND s.plan_type IN ('pro', 'trial') THEN true
        ELSE false
    END as ispro,
    s.trial_started_at as trialstartedat,
    s.trial_ends_at as trialendsat
FROM public.profiles p
LEFT JOIN public.subscriptions s ON p.id = s.user_id AND s.status = 'active';

-- Step 8: Create RLS policies for the view
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own user data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own user data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Step 9: Create function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.created_at,
        NEW.created_at
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 11: Create function to update profile on user update
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles 
    SET 
        email = NEW.email,
        updated_at = NOW()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 12: Create trigger to automatically update profile on user update
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_update(); 