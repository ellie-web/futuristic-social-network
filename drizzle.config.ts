import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'

export default defineConfig({
  dialect: 'sqlite',
  schema: './database/schema.ts',
  out: './database/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL_DRIZZLE!
  }
})