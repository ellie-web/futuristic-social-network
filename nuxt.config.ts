// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    'nuxt-auth-utils',
    '@nuxt/ui',
    '@nuxt/image',
    'nuxt-file-storage',
    '@pinia/nuxt'
  ],
  fileStorage: {
    mount: process.env.FILES_DIR
  },
  runtimeConfig: {
    filesDir: process.env.FILES_DIR
  }
})
