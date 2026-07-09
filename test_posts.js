const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read env variables
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Querying community_posts...");
  const { data: posts, error } = await supabase
    .from('community_posts')
    .select('*');
    
  if (error) {
    console.error("Query Error:", error);
  } else {
    console.log("Posts count:", posts.length);
    console.log("Posts:", posts);
  }
}

test();
