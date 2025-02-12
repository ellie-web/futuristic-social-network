import prisma from '~/lib/prisma'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
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
    const user = await prisma.user.findUnique({
      where: {
        id: validatedId.data
      },
      omit: {
        password: true
      }
    })


    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: `User '${validatedId.data}' not found`
      })
    }

    return user
  }

  catch (err: any) {
    if (err?.statusCode === 404) {
      throw err
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error getting the user'
    })
  }
})