import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'

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

    await db.insert(Subscription)
      .values({
        followerId: session.user.id,
        followingId: validatedId.data
      })


    // TODO: optimize !!
    // update 'followers' counter on the user thats being followed
    const followedUserName = await db.update(User)
      .set({
        followers: sql`${User.followers} + 1`
      })
      .where(eq(User.id, validatedId.data))
      .returning({name: User.name})

    // update 'following' counter on the follower
    await db.update(User)
      .set({
        following: sql`${User.following} + 1`
      })
      .where(eq(User.id, session.user.id))

    return followedUserName[0].name
  }

  catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error following the user'
    })
  }
})