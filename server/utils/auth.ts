import type { H3Event } from 'h3'
import prisma from '~/lib/prisma'
import bcrypt from 'bcrypt'
import IUser from '~/types/user'

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

  const result = await prisma.user.findFirst({
    where: {
      id: session.user.id
    },
    omit: {
      password: true
    }
  })

  return result
}

async function attempt(event: H3Event<Request>, email: string, password: string) {
  const foundUser = await prisma.user.findUnique({
    where: {
      email
    }
  })

  // compare the password hash
  if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
    // return an error if the user is not found or the password doesn't match
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password',
    });
  }

  // log in as the selected user
  await login(event, foundUser)

  return true
}

export default {
  login,
  user: getCurrentUser,
  attempt,
}