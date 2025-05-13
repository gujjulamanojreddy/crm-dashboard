import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gtydunuwdpfrxwyvwsjw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'admin123',
      options: {
        data: {
          name: 'Admin User'
        }
      }
    });

    if (error) {
      console.error('Error creating user:', error.message);
      return;
    }

    console.log('Test user created successfully:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

createTestUser();
