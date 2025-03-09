import { sql } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)?.query

  if (!query) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No query'
    })
  }

  try {
    const { db, User } = useDrizzle()

    const users = await db
      .select()
      .from(User)
      .where(sql`(
        setweight(to_tsvector('english', ${User.name}), 'A') ||
        setweight(to_tsvector('english', ${User.username}), 'B'))
        @@ to_tsquery('english', ${query + ':*'}
      )`)
      .limit(10)

    return users
  }
  catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error searching users'
    })
  }
})