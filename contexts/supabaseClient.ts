
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://lyxfqavjvglqqrvzjwgi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eGZxYXZqdmdscXFydnpqd2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNjM3ODgsImV4cCI6MjA3NzYzOTc4OH0.x9Up4D1-rMy_3k9-zaMLHivBhNYfKzjSLdGq0GnXoIc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

console.log('Supabase client initialized with URL:', supabaseUrl);
