import prisma from '~/lib/prisma'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const body = await readBody(event)

  const PostSchema = z.object({
    content: z
      .string({
        required_error: 'Post content can`t be empty'
      })
      .max(480),
    authorId: z.number()
  })

  const validatedData = PostSchema.safeParse({
    content: body.content,
    authorId: session.user.id
  })

  if (!validatedData.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validatedData.error.issues[0].message
    })
  }

  try {
    const createdPost = await prisma.post.create({
      data: validatedData.data
    })

    return createdPost
  }

  catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating post'
    })
  }
})