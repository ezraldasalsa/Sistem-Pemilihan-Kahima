-- Create admin account for Cahya
-- Note: The user will need to sign up through the normal signup flow with email: cahya@admin.unesa.ac.id and password: Cahya123
-- This script creates the profile entry that will be linked to the auth user

-- Insert admin profile (the auth user will be created when they sign up)
INSERT INTO profiles (
  id,
  email,
  full_name,
  password,
  role,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'cahya@admin.unesa.ac.id',
  'Cahya',
  'Cahya123'
  'admin',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = now();

-- Grant admin permissions
-- The profile will be automatically linked when the user signs up with the matching email
