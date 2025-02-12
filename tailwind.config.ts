import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  plugins: [
    require('tailwind-scrollbar-hide')
  ]
}