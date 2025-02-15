import { ServerFile } from 'nuxt-file-storage'
import { z } from 'zod'
import { eq } from 'drizzle-orm'

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

  if (validatedId.data !== session.user.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'not permitted'
    })
  }

  const { file } = await readBody<{ file: ServerFile }>(event)

  try {
    const fileName = await storeFileLocally(file, 12)

    const { db, User } = useDrizzle()

    await db.update(User)
      .set({ avatarUrl: fileName })
      .where(eq(User.id, session.user.id))
  }
  catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error while uploading avatar'
    })
  }
  return setResponseStatus(event, 204)
})