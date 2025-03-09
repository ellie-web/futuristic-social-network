import bcrypt from 'bcrypt'
import { InsertUser } from '~/database/schema'
import { userCreateSchema } from '~/types/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const validatedData = userCreateSchema
    .transform(val => ({
      ...val,
      name: val.name ? val.name : val.username
    }))
    .safeParse({
      email: body.email,
      name: body.name,
      username: body.username,
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
      statusMessage: err.message
    })
  }
})