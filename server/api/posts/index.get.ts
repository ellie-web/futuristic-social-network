import prisma from '~/lib/prisma'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // queries are strings so we transform them to numbers
  const QuerySchema = z.object({
    limit: z.string().transform((val, ctx) => {
      const parsed = parseInt(val)
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'limit must be a number',
        })
        return z.NEVER
      }
      else if (parsed < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'limit can`t be negative',
        })
        return z.NEVER
      }
      return parsed
    }),
    cursor: z.string().optional().transform((val, ctx) => {
      if (!val) return undefined
      const parsed = parseInt(val)
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'cursor must be a valid number',
        })
        return z.NEVER
      }
      return parsed
    })
  })

  const validatedQuery = QuerySchema.safeParse(query)

  if (!validatedQuery.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validatedQuery.error.issues[0].message
    })
  }

  try {
    const posts = await prisma.post.findMany({
      take: validatedQuery.data.limit,
      skip: validatedQuery.data.cursor ? 1 : 0, // skip cursor or skip zero
      cursor: validatedQuery.data.cursor 
        ? { id: validatedQuery.data.cursor }
        : undefined,
      include: {
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    })

    return {
      posts,
      nextCursor: posts.length === validatedQuery.data.limit ? posts[validatedQuery.data.limit - 1].id : undefined,
      hasMore: posts.length === validatedQuery.data.limit
    }
  }
  catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error getting posts'
    })
  }
})