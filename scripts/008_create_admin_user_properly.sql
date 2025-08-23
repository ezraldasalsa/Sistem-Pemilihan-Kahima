-- Create admin user account properly
-- Note: This creates the profile that will be linked when the admin signs up

-- First, let's check if the profile already exists and update it
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'cahya@admin.unesa.ac.id',
  'Cahya',
  'admin',
  now(),
  now()
) 
ON CONFLICT (email) 
DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = now();

-- Create a function to automatically set admin role for this specific email
CREATE OR REPLACE FUNCTION handle_admin_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'cahya@admin.unesa.ac.id' THEN
    -- Update the profile to admin role
    UPDATE profiles 
    SET 
      id = NEW.id,
      role = 'admin',
      updated_at = now()
    WHERE email = NEW.email;
    
    -- If no profile exists, create one
    IF NOT FOUND THEN
      INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
      VALUES (NEW.id, NEW.email, 'Cahya', 'admin', now(), now());
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically handle admin signup
DROP TRIGGER IF EXISTS on_admin_signup ON auth.users;
CREATE TRIGGER on_admin_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_admin_signup();
