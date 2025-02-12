import { ServerFile } from 'nuxt-file-storage'
import prisma from '~/lib/prisma'
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

  if (validatedId.data !== session.user.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'not permitted'
    })
  }

  const { file } = await readBody<{ file: ServerFile }>(event)

  try {
    const fileName = await storeFileLocally(file, 12)
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        avatarUrl: fileName
      }
    })
  }
  catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error while uploading avatar'
    })
  }
  return setResponseStatus(event, 204)
})