import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://slqdicomlbuhacmukbov.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNscWRpY29tbGJ1aGFjbXVrYm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyOTQzNzksImV4cCI6MjA2NDg3MDM3OX0.mCAK_F7C8IvJT2D_8kP25pIUrnjSNS5WljT9ES_ZD3c";

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 