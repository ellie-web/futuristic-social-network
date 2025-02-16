import type { H3Event } from 'h3'
import bcrypt from 'bcrypt'
import IUser from '~/types/user'
import { eq } from 'drizzle-orm'

// Logs the user in as the given user model
async function login(event: H3Event<Request>, user: IUser) {
  await replaceUserSession(event, {
    // @ts-ignore
    user: {
      id: user.id,
      email: user.email,
    },
    loggedInAt: new Date()
  })
}

async function getCurrentUser(event: H3Event<Request>) {
  const session = await getUserSession(event)

  // return null if there's no user
  if (!session.user) {
    return null
  }

  try {
    const { db, User } = useDrizzle()

    const result = await db.query.User.findFirst({
      where: eq(User.id, session.user!.id),
      columns: {
        password: false
      }
    })

    return result
  }
  catch (err) {
    throw createError({
      status: 404,
      statusMessage: 'Error getting current user'
    })
  }
}

async function attempt(event: H3Event<Request>, email: string, password: string) {
  
  try {
    const { db, User } = useDrizzle()

    const foundUser = await db.query.User.findFirst({
      where: eq(User.email, email)
    })

    // compare the password hash
    if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
      // return an error if the user is not found or the password doesn't match
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password',
      })
    }

    // log in as the selected user
    await login(event, foundUser)

    return true
  }
  catch(err) {
    throw err
  }
}

export default {
  login,
  user: getCurrentUser,
  attempt,
}