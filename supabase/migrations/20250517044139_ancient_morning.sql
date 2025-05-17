/*
  # Create events table and set up RLS policies

  1. New Tables
    - `events`
      - Event details
      - Date and time tracking
      - Location and organizer information
      - Budget tracking
      - Status management

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  description text,
  location text NOT NULL,
  budget numeric(10,2),
  status text NOT NULL CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
  organizer text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
ON events
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON events
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON events
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON events
FOR DELETE
TO authenticated
USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();