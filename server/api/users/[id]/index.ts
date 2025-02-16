import { z } from 'zod'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  const IdSchema = z.number({message: 'id must be a number'})
  const validatedId = IdSchema.safeParse(id)

  if (!validatedId.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validatedId.error.issues[0].message
    })
  }

  try {
    const { db, User } = useDrizzle()

    const user = await db.query.User.findFirst({
      where: eq(User.id, validatedId.data),
      columns: {
        password: false
      }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: `User '${validatedId.data}' not found`
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