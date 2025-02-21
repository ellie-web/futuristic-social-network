import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import 'dotenv/config'

import * as schema from '../../database/schema'

export default function() {
  const client = postgres(process.env.SUPABASE_URL!, { prepare: false })
  const db = drizzle({ client, schema })

  const { User, Post, Subscription, Like } = schema

  return {
    db,
    User,
    Post,
    Subscription,
    Like
  }
}