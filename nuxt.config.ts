import { services, site } from './shared/site'

const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://laianenicole.vercel.app').replace(/\/$/, '')

export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',
  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Opcional: cookie "sessionid" de uma conta do Instagram pra deixar o scraper mais estável na Vercel.
    igSessionId: '',
    public: {
      siteUrl,
      whatsapp: site.whatsapp,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      meta: [
        { name: 'theme-color', content: '#7a0b35' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Manrope:wght@400;500;600;700&display=swap',
        },
        { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'LLMs.txt' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  routeRules: {
    '/': { prerender: true },
    '/servicos/**': { prerender: true },
    // Feed do Instagram: a Vercel guarda a resposta por 6h e revalida em segundo plano.
    '/api/instagram': { isr: 60 * 60 * 6 },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml', '/robots.txt', '/llms.txt', '/llm.txt', ...services.map(s => `/servicos/${s.slug}`)],
    },
  },

  vite: {
    optimizeDeps: { include: ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText', 'lenis', 'three'] },
  },
})
