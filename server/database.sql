-- MarineCatch Africa Database Schema for Supabase
-- Run this SQL in your self-hosted Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (links to Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('fisher', 'buyer', 'admin')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fisher profiles
CREATE TABLE IF NOT EXISTS fisher_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  boat_name TEXT,
  boat_type TEXT,
  license_number TEXT,
  fishing_zone TEXT,
  years_experience INTEGER,
  catch_capacity NUMERIC,
  country TEXT NOT NULL,
  region TEXT,
  port TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  rating NUMERIC(3,2),
  total_catches INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buyer profiles
CREATE TABLE IF NOT EXISTS buyer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT,
  business_type TEXT NOT NULL,
  business_license TEXT,
  country TEXT NOT NULL,
  region TEXT,
  address TEXT,
  preferred_species TEXT[],
  min_order_quantity NUMERIC,
  max_order_quantity NUMERIC,
  is_verified BOOLEAN DEFAULT false,
  rating NUMERIC(3,2),
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Catches (fish listings)
CREATE TABLE IF NOT EXISTS catches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fisher_id UUID NOT NULL REFERENCES fisher_profiles(id) ON DELETE CASCADE,
  species TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  price_per_unit NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  quality TEXT NOT NULL,
  catch_date DATE NOT NULL,
  location TEXT,
  description TEXT,
  image_urls TEXT[],
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES buyer_profiles(id) ON DELETE CASCADE,
  fisher_id UUID NOT NULL REFERENCES fisher_profiles(id) ON DELETE CASCADE,
  catch_id UUID NOT NULL REFERENCES catches(id) ON DELETE CASCADE,
  quantity NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  delivery_address TEXT,
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to restore catch quantity when order is cancelled
CREATE OR REPLACE FUNCTION restore_catch_quantity(p_catch_id UUID, p_quantity NUMERIC)
RETURNS VOID AS $$
BEGIN
  UPDATE catches
  SET 
    quantity = quantity + p_quantity,
    is_available = true,
    updated_at = NOW()
  WHERE id = p_catch_id;
END;
$$ LANGUAGE plpgsql;

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_fisher_profiles_user_id ON fisher_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_fisher_profiles_country ON fisher_profiles(country);
CREATE INDEX IF NOT EXISTS idx_fisher_profiles_is_verified ON fisher_profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_user_id ON buyer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_country ON buyer_profiles(country);
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_is_verified ON buyer_profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_catches_fisher_id ON catches(fisher_id);
CREATE INDEX IF NOT EXISTS idx_catches_is_available ON catches(is_available);
CREATE INDEX IF NOT EXISTS idx_catches_species ON catches(species);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_fisher_id ON orders(fisher_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fisher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE catches ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- SERVICE ROLE BYPASS POLICIES (required for backend operations)
CREATE POLICY "Service role full access to users" ON users
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access to fisher_profiles" ON fisher_profiles
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access to buyer_profiles" ON buyer_profiles
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access to catches" ON catches
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access to orders" ON orders
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- USER POLICIES
-- Allow authenticated users to read their own user data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Fisher profiles policies
CREATE POLICY "Fishers can read own profile" ON fisher_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Fishers can insert own profile" ON fisher_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Fishers can update own profile" ON fisher_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Buyer profiles policies
CREATE POLICY "Buyers can read own profile" ON buyer_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Buyers can insert own profile" ON buyer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Buyers can update own profile" ON buyer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Catches policies
CREATE POLICY "Fishers can manage own catches" ON catches
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM fisher_profiles 
      WHERE fisher_profiles.id = catches.fisher_id 
      AND fisher_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read available catches" ON catches
  FOR SELECT USING (is_available = true);

-- Orders policies
CREATE POLICY "Buyers can manage own orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM buyer_profiles 
      WHERE buyer_profiles.id = orders.buyer_id 
      AND buyer_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Fishers can view orders for their catches" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM fisher_profiles 
      WHERE fisher_profiles.id = orders.fisher_id 
      AND fisher_profiles.user_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fisher_profiles_updated_at
  BEFORE UPDATE ON fisher_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buyer_profiles_updated_at
  BEFORE UPDATE ON buyer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_catches_updated_at
  BEFORE UPDATE ON catches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
