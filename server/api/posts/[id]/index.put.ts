import { eq } from 'drizzle-orm'
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

  const body = await readBody(event)

  const PostSchema = z.object({
    content: z
    .string({
      required_error: 'Post content can`t be empty'
    })
    .max(480),
    authorId: z.number().refine(val => val === session.user.id)
  })

  const validatedData = PostSchema.safeParse({
    content: body.content,
    authorId: body.authorId
  })

  if (!validatedData.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validatedData.error.issues[0].message
    })
  }

  try {
    const { db, Post } = useDrizzle()

    const post = await db.update(Post)
      .set({content: validatedData.data.content})
      .where(eq(Post.id, validatedId.data))
      .returning()

    if (!post) {
      throw createError({
        status: 404,
        statusMessage: 'Error getting the post'
      })
    }

    return post[0]
  }

  catch(err) {
    throw err
  }
})
