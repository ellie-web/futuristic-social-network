import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'

export default defineConfig({
  dialect: 'postgresql',
  schema: './database/schema.ts',
  out: './database/migrations',
  dbCredentials: {
    url: process.env.SUPABASE_URL!
  }
})