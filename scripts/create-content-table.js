import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL?.trim().replace(/^"|"$/g, '');
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim().replace(/^"|"$/g, '');

if (!supabaseUrl) throw new Error('Missing environment variable: VITE_SUPABASE_URL');
if (!supabaseAnonKey) throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createContentTable() {
  const { error } = await supabase
    .rpc('create_content_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS content (
            id text PRIMARY KEY,
            content text NOT NULL,
            updated_at timestamptz DEFAULT now()
        );
        
        GRANT ALL ON content TO authenticated;
        GRANT ALL ON content TO anon;
      `
    });

  if (error) {
    console.error('Error creating content table:', error);
    process.exit(1);
  }

  console.log('Content table created successfully');
}

createContentTable();
