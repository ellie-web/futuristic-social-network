import { drizzle } from 'drizzle-orm/libsql'
import 'dotenv/config'

import * as schema from '../../database/schema'

export default function() {
  const db = drizzle(process.env.DATABASE_URL_DRIZZLE!, {schema})

  const User = schema.User
  const Post = schema.Post

  return {
    db,
    User,
    Post
  }
}