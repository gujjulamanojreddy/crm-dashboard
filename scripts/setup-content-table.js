const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupContentTable() {
  try {
    // Create the content table
    const { error: createError } = await supabase.rpc('create_content_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.content (
            id text PRIMARY KEY,
            content text NOT NULL,
            updated_at timestamptz DEFAULT now()
        );

        -- Grant necessary permissions
        GRANT ALL ON public.content TO authenticated;
        GRANT ALL ON public.content TO anon;

        -- Disable RLS temporarily to allow all operations
        ALTER TABLE public.content DISABLE ROW LEVEL SECURITY;
      `
    });

    if (createError) {
      console.error('Error creating table:', createError);
      return;
    }

    console.log('Content table setup completed successfully');

    // Insert initial content
    const initialContent = [
      {
        id: 'privacy-policy',
        content: 'Privacy Policy\n\n1. Information We Collect...',
        updated_at: new Date().toISOString()
      },
      {
        id: 'shipping-policy',
        content: 'Shipping Policy\n\n1. Processing Time...',
        updated_at: new Date().toISOString()
      },
      {
        id: 'terms-conditions',
        content: 'Terms & Conditions\n\n1. Agreement...',
        updated_at: new Date().toISOString()
      }
    ];

    const { error: insertError } = await supabase
      .from('content')
      .upsert(initialContent);

    if (insertError) {
      console.error('Error inserting initial content:', insertError);
      return;
    }

    console.log('Initial content inserted successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

setupContentTable();
