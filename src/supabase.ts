import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xjcfbtqrkzrtrltuushg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqY2ZidHFya3pydHJsdHV1c2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDQyMTMsImV4cCI6MjA5NzA4MDIxM30.UI_aVwML0BQ50anJQK9DZxSuaOeDL_rdNabbjQt7YDw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)