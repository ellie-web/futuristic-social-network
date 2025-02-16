import { z } from 'zod'
import { and, eq } from 'drizzle-orm'
import { withCursorPagination } from 'drizzle-pagination'

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
    }),
    userId: z.string().optional().transform((val, ctx) => {
      if (!val) return undefined
      const parsed = parseInt(val)
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'userId must be a valid number',
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
    const { db, Post } = useDrizzle()

    const where = []

    if (validatedQuery.data.userId) {
      where.push(eq(Post.authorId, validatedQuery.data.userId))
    }

    const posts = await db.query.Post.findMany({
      ...withCursorPagination({
        where: and(...where),
        cursors: [
          [
            Post.createdAt,
            'desc',
            validatedQuery.data.cursor
          ]
        ],
        limit: validatedQuery.data.limit,
      }),
      with: {
        author: {
          columns: {
            name: true,
            avatarUrl: true
          }
        }
      }
    })

    return {
      posts,
      nextCursor: posts.length === validatedQuery.data.limit ? posts[validatedQuery.data.limit - 1].createdAt : undefined,
      hasMore: posts.length === validatedQuery.data.limit
    }
  }
  catch (err) {
    console.log(err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error getting posts'
    })
  }
})