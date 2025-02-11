import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const posts = prisma.post.findMany()
  return posts
})