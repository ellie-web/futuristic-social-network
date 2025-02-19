import { z } from 'zod'
import { and, eq, sql } from 'drizzle-orm'

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
    const { db, Subscription, User } = useDrizzle()

    await db.delete(Subscription)
      .where(
        and(
          eq(Subscription.followerId, session.user.id),
          eq(Subscription.followingId, validatedId.data)
        )
      )

    // update 'followers' counter on the user thats being unfollowed
    const unfollowedUserName = await db.update(User)
      .set({
        followers: sql`${User.followers} - 1`
      })
      .where(eq(User.id, validatedId.data))
      .returning({name: User.name})

    // update 'following' counter on the current user
    await db.update(User)
      .set({
        following: sql`${User.following} - 1`
      })
      .where(eq(User.id, session.user.id))

    return unfollowedUserName[0].name
  }

  catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error unfollowing the user'
    })
  }
})