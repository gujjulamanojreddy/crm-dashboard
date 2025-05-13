-- Create content table for storing terms, privacy policy, etc.
CREATE TABLE IF NOT EXISTS content (
    id text PRIMARY KEY,
    content text NOT NULL,
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Policies for content table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read content" ON content;
DROP POLICY IF EXISTS "Allow authenticated users to insert content" ON content;
DROP POLICY IF EXISTS "Allow authenticated users to update content" ON content;

-- Create RLS policies that allow authenticated users to perform all operations
CREATE POLICY "Allow authenticated users to select content"
    ON content
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert content"
    ON content
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update content"
    ON content
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete content"
    ON content
    FOR DELETE
    TO authenticated
    USING (true);
