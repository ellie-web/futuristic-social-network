import { z } from 'zod'
import { and, count, eq, sql } from 'drizzle-orm'

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
    const { db, Like, Post } = useDrizzle()

    await db.delete(Like)
      .where(
        and(
          eq(Like.userId, session.user.id),
          eq(Like.postId, validatedId.data)
        )
      )

    // TODO: optimize !!
    // update 'likes' counter on the unliked post
    const likes = await db.select({count: count()})
      .from(Like)
      .where(eq(Like.postId, validatedId.data))

    console.log(likes[0])
      
    const updatedPost = await db.update(Post)
      .set({
        likes: likes[0].count
      })
      .where(eq(Post.id, validatedId.data))
      .returning({likes: Post.likes})

    return updatedPost[0].likes
  }

  catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error unliking the post'
    })
  }
})