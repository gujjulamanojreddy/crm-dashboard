import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey!);

async function createContentTable() {
  const { data, error } = await supabase
    .from('_content_setup')
    .select()
    .limit(1)
    .execute(`
      CREATE TABLE IF NOT EXISTS content (
          id text PRIMARY KEY,
          content text NOT NULL,
          updated_at timestamptz DEFAULT now()
      );
      
      GRANT ALL ON content TO authenticated;
      GRANT ALL ON content TO anon;
    `);

  if (error) {
    console.error('Error creating content table:', error);
    process.exit(1);
  }

  console.log('Content table created successfully');
}

createContentTable();
