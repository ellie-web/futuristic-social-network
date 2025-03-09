import { z } from 'zod'
import { and, desc, eq, exists, getTableColumns, lt, SQL, sql } from 'drizzle-orm'

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
      const parsed = new Date(val)
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

  const { user } = await getUserSession(event)

  try {
    const { db, Post, Like, User } = useDrizzle()


    const filters: SQL[] = [];

    if (validatedQuery.data.userId) {
      filters.push(eq(Post.authorId, validatedQuery.data.userId))
    }

    if (validatedQuery.data.cursor) {
      filters.push(lt(Post.createdAt, validatedQuery.data.cursor))
    }

    const likeSubquery = db
      .select({ id: sql`1` })
      .from(Like)
      .where(and(
        eq(Like.postId, Post.id),
        eq(Like.userId, user!.id)
      ));

    const posts = await db
      .select({
        // Select Post fields
        ...getTableColumns(Post),
        // Select specific author fields
        author: {
          name: User.name,
          username: User.username,
          avatarUrl: User.avatarUrl
        },
        isLiked: exists(user ? likeSubquery : sql`false`)
      })
      .from(Post)
      .leftJoin(User, eq(Post.authorId, User.id))
      .where(and(...filters))
      .orderBy(desc(Post.createdAt))
      .limit(validatedQuery.data.limit)

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