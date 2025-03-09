import { eq } from 'drizzle-orm'
import { z } from 'zod'

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
    const { db, Post } = useDrizzle()

    const post = await db.query.Post.findFirst({
      where: eq(Post.id, validatedId.data),
      with: {
        author: {
          columns: {
            name: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    })

    if (!post) {
      throw createError({
        status: 404,
        statusMessage: 'Error getting the post'
      })
    }

    return post
  }

  catch(err) {
    throw err
  }
})
