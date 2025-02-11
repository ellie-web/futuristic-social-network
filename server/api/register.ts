import prisma from '~/lib/prisma'
import bcrypt from 'bcrypt'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const RegisterSchema = z.object({
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email(),
    password: z
      .string()
      .min(8, 'Password must contain at least 8 symbols'),
    name: z
      .string()
      .optional()
  }).transform(val => ({
    ...val,
    name: val.name ? val.name : val.email
  }))

  const validatedData = RegisterSchema.safeParse({
    email: body.email,
    name: body.name,
    password: body.password
  })

  if (!validatedData.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validatedData.error.issues[0].message
    })
  }

  try {
    // hash the password before storing it in the database
    const passwordHash = bcrypt.hashSync(validatedData.data.password, 12)

    const createdUser = await prisma.user.create({
      data: {
        ...validatedData.data,
        password: passwordHash
      }
    })
    
    if (createdUser) {
      await auth.login(event, createdUser)
    }
  }

  catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error registering user'
    })
  }
})