-- Create login_history table
CREATE TABLE IF NOT EXISTS login_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    ip_address TEXT,
    user_agent TEXT,
    login_timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    login_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add RLS policies
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own login history
CREATE POLICY "Users can view their own login history"
    ON login_history FOR SELECT
    USING (auth.uid() = user_id);

-- Allow insert for all (we'll validate in the application)
CREATE POLICY "Allow insert for all"
    ON login_history FOR INSERT
    WITH CHECK (true);

-- Create index on user_id and login_timestamp for faster queries
CREATE INDEX login_history_user_id_idx ON login_history(user_id);
CREATE INDEX login_history_timestamp_idx ON login_history(login_timestamp);