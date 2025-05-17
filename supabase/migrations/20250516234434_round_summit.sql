/*
  # Fix Inventory Items RLS Policies

  1. Changes
    - Remove existing RLS policies for inventory_items table
    - Create new policies using correct auth.role() function
    - Enable RLS on inventory_items table (in case it was disabled)

  2. Security
    - Enable RLS
    - Add policies for CRUD operations for authenticated users
*/

-- First, drop existing policies
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON inventory_items;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON inventory_items;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON inventory_items;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON inventory_items;

-- Make sure RLS is enabled
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Create new policies with correct auth.role() function
CREATE POLICY "Enable read access for authenticated users"
ON inventory_items
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON inventory_items
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON inventory_items
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON inventory_items
FOR DELETE
TO authenticated
USING (true);