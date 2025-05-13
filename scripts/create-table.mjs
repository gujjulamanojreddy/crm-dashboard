const sql = `
  CREATE TABLE IF NOT EXISTS content (
      id text PRIMARY KEY,
      content text NOT NULL,
      updated_at timestamptz DEFAULT now()
  );
  
  GRANT ALL ON content TO authenticated;
  GRANT ALL ON content TO anon;
`;

fetch('https://api.supabase.com/v1/projects/gtydunuwdpfrxwyvwsjw/sql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`
  },
  body: JSON.stringify({ query: sql })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
