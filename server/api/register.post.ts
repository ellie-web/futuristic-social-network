import bcrypt from 'bcrypt'
import { ServerFile } from 'nuxt-file-storage'
import { z } from 'zod'
import { InsertUser } from '~/database/schema'

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
      .optional(),
    avatarUrl: z
      .undefined()
  }).transform(val => ({
    ...val,
    name: val.name ? val.name : val.email
  }))

  const validatedData = RegisterSchema.safeParse({
    email: body.email,
    name: body.name,
    avatarUrl: body.avatarUrl,
    password: body.password
  })

  if (!validatedData.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validatedData.error.issues[0].message
    })
  }

  try {
    const { db, User } = useDrizzle()

    // hash the password before storing it in the database
    const passwordHash = bcrypt.hashSync(validatedData.data.password, 12)

    const createdUser = await db.insert(User)
      .values({
        ...validatedData.data,
        password: passwordHash
      } as InsertUser)
      .returning()
      
    if (createdUser) {
      await auth.login(event, createdUser[0])
    }
  }

  catch (err: any) {
    console.log(err.toString())
    throw createError({
      statusCode: 500,
      message: err.message
    })
  }
})