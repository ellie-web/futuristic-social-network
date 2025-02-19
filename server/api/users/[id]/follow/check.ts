import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

type TResponse = {
  isFollowing: boolean,
  isBeingFollowed: boolean
}

export default defineEventHandler(async (event): Promise<TResponse> => {
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
    const { db, Subscription } = useDrizzle()

    // check if the current user is following the user with the provided id
    const following = await db.query.Subscription.findFirst({
      where: and(
        eq(Subscription.followerId, session.user.id),
        eq(Subscription.followingId, validatedId.data)
      )
    })

    // check if the user with the provided id is following the current user
    const followed = await db.query.Subscription.findFirst({
      where: and(
        eq(Subscription.followerId, validatedId.data),
        eq(Subscription.followingId, session.user.id)
      )
    })

    return {
      isFollowing: !!following,
      isBeingFollowed: !!followed
    }
  }

  catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error checking follow'
    })
  }
})