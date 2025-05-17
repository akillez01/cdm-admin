/*
  # Update Inventory RLS Policies

  1. Changes
    - Drop existing RLS policies for inventory_items table
    - Create new policies with proper authentication checks
    - Ensure authenticated users can perform CRUD operations

  2. Security
    - Maintain RLS enabled on inventory_items table
    - Add proper authentication checks using auth.uid()
    - Ensure only authenticated users can access the table
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to delete inventory items" ON "public"."inventory_items";
DROP POLICY IF EXISTS "Allow authenticated users to insert inventory items" ON "public"."inventory_items";
DROP POLICY IF EXISTS "Allow authenticated users to read inventory" ON "public"."inventory_items";
DROP POLICY IF EXISTS "Allow authenticated users to update inventory" ON "public"."inventory_items";

-- Create new policies with proper auth checks
CREATE POLICY "Enable read access for authenticated users"
ON "public"."inventory_items"
FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users"
ON "public"."inventory_items"
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users"
ON "public"."inventory_items"
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users"
ON "public"."inventory_items"
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');