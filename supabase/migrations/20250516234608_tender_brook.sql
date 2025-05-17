/*
  # Set up RLS policies for members and transactions tables

  1. Changes
    - Enable RLS on members table
    - Create CRUD policies for members table
    - Create transactions table with RLS enabled
    - Create CRUD policies for transactions table

  2. Security
    - All operations require authentication
    - Authenticated users can perform all CRUD operations
*/

-- First, make sure RLS is enabled for members table
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for members if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON members;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON members;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON members;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON members;

-- Create new policies for members table
CREATE POLICY "Enable read access for authenticated users"
ON members
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON members
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON members
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON members
FOR DELETE
TO authenticated
USING (true);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id),
  member_name text,
  type text NOT NULL CHECK (type IN ('tithe', 'offering', 'donation', 'expense')),
  amount numeric(10,2) NOT NULL,
  date timestamptz NOT NULL DEFAULT now(),
  category text NOT NULL,
  description text,
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'check', 'card', 'pix', 'transfer')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for transactions table
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions table
CREATE POLICY "Enable read access for authenticated users"
ON transactions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON transactions
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON transactions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON transactions
FOR DELETE
TO authenticated
USING (true);

-- Create updated_at trigger for transactions
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();