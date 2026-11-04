<script setup lang="ts">
import { faq, site, testimonials } from '#shared/site'

const url = useSiteUrl()
const config = useRuntimeConfig()
const whatsapp = String(config.public.whatsapp || site.whatsapp).replace(/\D/g, '')
const title = 'Extensão de Cílios em Balneário Camboriú | Laiane Nicole Lash Designer'

useSeoMeta({
  title,
  description: site.description,
  ogTitle: title,
  ogDescription: 'Fio a fio, volume brasileiro, efeito molhado e lash lifting no bairro Nações, em Balneário Camboriú. Agende pelo WhatsApp.',
  ogType: 'website',
  ogLocale: 'pt_BR',
  ogSiteName: site.brand,
  ogUrl: url,
  ogImage: `${url}/og.jpg`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Laiane Nicole, lash designer em Balneário Camboriú',
  twitterCard: 'summary_large_image',
  twitterImage: `${url}/og.jpg`,
  robots: 'index, follow, max-image-preview:large',
})
useHead({
  link: [{ rel: 'canonical', href: `${url}/` }],
  meta: [
    { name: 'geo.region', content: 'BR-SC' },
    { name: 'geo.placename', content: 'Balneário Camboriú' },
  ],
})

useJsonLd([
  businessSchema(url, whatsapp),
  { '@type': 'WebSite', '@id': `${url}/#site`, 'url': url, 'name': site.brand, 'inLanguage': 'pt-BR', 'publisher': { '@id': `${url}/#negocio` } },
  { '@type': 'WebPage', '@id': `${url}/#pagina`, 'url': url, 'name': title, 'isPartOf': { '@id': `${url}/#site` }, 'about': { '@id': `${url}/#negocio` }, 'inLanguage': 'pt-BR' },
  faqSchema(faq),
])
</script>

<template>
  <div>
    <HeroSection />
    <MarqueeBand />
    <ManifestoSection />
    <ServicesSection />
    <GallerySection />
    <ProcessSection />
    <TestimonialsSection v-if="testimonials.length" :items="testimonials" />
    <CareSection />
    <FaqSection :items="faq" />
    <LocationSection />
    <FinalCta />
  </div>
</template>
