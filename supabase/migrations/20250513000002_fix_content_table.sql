-- Disable RLS to allow all operations
ALTER TABLE content DISABLE ROW LEVEL SECURITY;

-- Remove any existing policies
DROP POLICY IF EXISTS "content_policy" ON content;
DROP POLICY IF EXISTS "Allow authenticated users to read content" ON content;
DROP POLICY IF EXISTS "Allow authenticated users to insert content" ON content;
DROP POLICY IF EXISTS "Allow authenticated users to update content" ON content;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON content;

-- Make sure the content table exists and has the right structure
CREATE TABLE IF NOT EXISTS content (
    id text PRIMARY KEY,
    content text NOT NULL,
    updated_at timestamptz DEFAULT now()
);

-- Grant all privileges to authenticated users
GRANT ALL ON content TO authenticated;
GRANT ALL ON content TO anon;

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
