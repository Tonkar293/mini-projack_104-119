// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#0284c7', // Light Blue
            secondary: '#64748b',
            background: '#f8fafc',
            surface: '#ffffff',
          }
        },
        dark: {
          dark: true,
          colors: {
            primary: '#38bdf8', // Lighter Blue for dark mode
            secondary: '#94a3b8',
            background: '#0f172a', // Slate 900
            surface: '#1e293b', // Slate 800
          }
        }
      }
    }
  })
  app.vueApp.use(vuetify)
})