/*
  # Add DELETE policy for inventory items

  1. Changes
    - Add DELETE policy for inventory_items table to allow authenticated users to delete items
  
  2. Security
    - Allows authenticated users to delete inventory items
    - Maintains consistency with existing INSERT/SELECT/UPDATE policies
*/

CREATE POLICY "Allow authenticated users to delete inventory items"
ON public.inventory_items
FOR DELETE
TO authenticated
USING (true);