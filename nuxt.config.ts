export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  
  runtimeConfig: {
    gmailUser: process.env.GMAIL_USER,
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
    destinationEmail: process.env.DESTINATION_EMAIL,
  },

  app: {
    head: {
      title: 'A Special Invitation for You 💖',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Would you go out on a date with me?' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'https://i.pinimgproxy.com/?url=aHR0cHM6Ly9jZG4taWNvbnMtcG5nLmZsYXRpY29uLmNvbS8yNTYvMTg1NjEvMTg1NjE0NzMucG5n&ts=1780243159&sig=615c68719abd139392b4cd90aa2c7bc80c62b8aa26d67fcc0dfa443d6677441a' },
        
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Sacramento&display=swap' }
      ]
    }
  }
})