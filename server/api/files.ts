import * as path from 'node:path'
import { stat, readFile } from 'node:fs/promises'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  if (!query.fileName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'fileName should not be empty'
    })
  }

  const { filesDir } = useRuntimeConfig()

  return serveStatic(event, {
    getContents: () => readFile(path.join(filesDir, query.fileName as string)),
    getMeta: async () => {
      const stats = await stat(path.join(filesDir, query.fileName as string)).catch(() => {})

      if (!stats || !stats.isFile()) {
        return
      }

      return {
        size: stats.size,
        mtime: stats.mtimeMs,
      }
    }
  })
})