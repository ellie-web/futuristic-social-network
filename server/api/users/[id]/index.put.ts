import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { userUpdateSchema } from '~/types/schema'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody(event)

  const IdSchema = z.number({message: 'id must be a number'})
  const validatedId = IdSchema.safeParse(id)

  if (!validatedId.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validatedId.error.issues[0].message
    })
  }

  const validatedData = userUpdateSchema
    .safeParse({
      name: body.name,
      bio: body.bio
    })

  if (!validatedData.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validatedData.error.issues[0].message
    })
  }

  try {
    const { db, User } = useDrizzle()

    const user = await db.update(User)
      .set({
        name: validatedData.data.name,
        bio: validatedData.data.bio
      })
      .where(eq(User.id, validatedId.data))
      .returning({
        id: User.id,
        name: User.name,
        bio: User.bio
      })

    if (!user) {
      throw createError({
        status: 404,
        statusMessage: 'Error getting the user'
      })
    }

    return user[0]
  }

  catch(err) {
    throw err
  }
})