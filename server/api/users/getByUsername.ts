import { z } from 'zod'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const username = getQuery(event)?.username

  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No username'
    })
  }

  try {
    const { db, User } = useDrizzle()

    const user = await db.query.User.findFirst({
      where: eq(User.username, username.toString()),
      columns: {
        password: false
      }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: `User '@${username}' not found`
      })
    }

    return user
  }

  catch (err: any) {
    if (err?.statusCode === 404) {
      throw err
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error getting the user'
    })
  }
})