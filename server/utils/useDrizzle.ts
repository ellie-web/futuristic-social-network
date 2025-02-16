import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import 'dotenv/config'

import * as schema from '../../database/schema'

export default function() {
  const client = postgres(process.env.SUPABASE_URL!, { prepare: false })
  const db = drizzle({ client, schema })

  const User = schema.User
  const Post = schema.Post
  const Subscription = schema.Subscription

  return {
    db,
    User,
    Post,
    Subscription
  }
}