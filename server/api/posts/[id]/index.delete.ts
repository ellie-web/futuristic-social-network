import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

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
    const { db, Post } = useDrizzle()

    await db.delete(Post).where(
      and(
        eq(Post.id, validatedId.data),
        eq(Post.authorId, Number(session.user.id))
      )
    )

    return setResponseStatus(event, 204)
  }
  catch(err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error deleting the post'
    })
  }
})