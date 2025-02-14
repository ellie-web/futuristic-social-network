export default defineEventHandler(async (event) => {
  return await auth.user(event)
})