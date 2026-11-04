<script setup lang="ts">
import { faq as generalFaq, services, site } from '#shared/site'

const route = useRoute()
const service = services.find(s => s.slug === route.params.slug)
if (!service) throw createError({ statusCode: 404, statusMessage: 'Técnica não encontrada', fatal: true })

const url = useSiteUrl()
const config = useRuntimeConfig()
const whatsapp = String(config.public.whatsapp || site.whatsapp).replace(/\D/g, '')
const wa = useWhatsapp(`Oi, Laiane! Vim pelo site e quero saber mais sobre ${service.name}.`)
const pageUrl = `${url}/servicos/${service.slug}`
const title = `${service.name} em Balneário Camboriú | Laiane Nicole Lash Designer`
const faqs = [...service.faq, ...generalFaq.filter(f => /agendar|Onde fica|estraga/.test(f.q))]
const others = services.filter(s => s.slug !== service.slug)

useSeoMeta({
  title,
  description: `${service.intro} Atendimento com hora marcada no bairro Nações, Balneário Camboriú.`.slice(0, 160),
  ogTitle: title,
  ogDescription: service.short,
  ogType: 'website',
  ogLocale: 'pt_BR',
  ogUrl: pageUrl,
  ogImage: `${url}/og.jpg`,
  twitterCard: 'summary_large_image',
  keywords: service.keywords.join(', '),
})
useHead({ link: [{ rel: 'canonical', href: pageUrl }] })
useJsonLd([
  businessSchema(url, whatsapp),
  {
    '@type': 'Service',
    '@id': `${pageUrl}#servico`,
    'name': service.name,
    'serviceType': 'Extensão de cílios',
    'description': [service.intro, ...service.body].join(' '),
    'provider': { '@id': `${url}/#negocio` },
    'areaServed': { '@type': 'City', 'name': 'Balneário Camboriú' },
    'url': pageUrl,
  },
  {
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Início', 'item': `${url}/` },
      { '@type': 'ListItem', 'position': 2, 'name': 'Técnicas', 'item': `${url}/#servicos` },
      { '@type': 'ListItem', 'position': 3, 'name': service.name, 'item': pageUrl },
    ],
  },
  faqSchema(faqs),
])

const el = ref<HTMLElement | null>(null)
useMotion(el, ({ gsap, SplitText }) => {
  const split = SplitText.create('.svc-hero__title', { type: 'lines,words', mask: 'lines' })
  gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 })
    .from(split.words, { yPercent: 110, duration: 1.2, stagger: 0.04 })
    .to('.svc-hero [data-reveal]', { opacity: 1, y: 0, duration: 1, stagger: 0.08, startAt: { y: 24 } }, '-=0.8')
    .from('.svc-hero__glyph', { opacity: 0, scale: 0.85, rotate: -6, duration: 1.6 }, '<')
  gsap.to('.svc-body [data-reveal]', {
    opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, startAt: { y: 30 },
    scrollTrigger: { trigger: '.svc-body', start: 'top 80%', once: true },
  })
  gsap.to('.svc-hero__glyph', {
    yPercent: 20, rotate: 4, ease: 'none',
    scrollTrigger: { trigger: '.svc-hero', start: 'top top', end: 'bottom top', scrub: true },
  })
})
</script>

<template>
  <div v-if="service" ref="el">
    <section class="svc-hero grain">
      <BrushLeaves class="svc-hero__leaves" />
      <div class="container svc-hero__grid">
        <div>
          <nav class="crumbs" aria-label="Você está em" data-reveal>
            <NuxtLink to="/">Início</NuxtLink> <span>/</span> <NuxtLink to="/#servicos">Técnicas</NuxtLink> <span>/</span> <span aria-current="page">{{ service.name }}</span>
          </nav>
          <p class="eyebrow" data-reveal>{{ service.kicker }} · Balneário Camboriú</p>
          <h1 class="svc-hero__title display-lg">{{ service.name }} <em class="serif-italic">em Balneário Camboriú</em></h1>
          <p class="svc-hero__lead" data-reveal>{{ service.short }}</p>
          <div class="svc-hero__ctas" data-reveal>
            <a v-magnetic :href="wa" target="_blank" rel="noopener" class="btn">Agendar {{ service.name.toLowerCase() }} <AppIcon name="whatsapp" class="btn__icon" /></a>
            <NuxtLink to="/#resultados" class="btn btn--ghost">Ver resultados</NuxtLink>
          </div>
        </div>
        <div class="svc-hero__glyph" aria-hidden="true">
          <LashGlyph v-bind="service.glyph" />
        </div>
      </div>
    </section>

    <section class="section svc-body">
      <div class="container svc-body__grid">
        <div class="svc-body__text">
          <h2 class="display-md" data-reveal>O que é {{ service.name.toLowerCase() }}</h2>
          <p class="svc-body__intro" data-reveal>{{ service.intro }}</p>
          <p v-for="p in service.body" :key="p" data-reveal>{{ p }}</p>
        </div>
        <aside class="svc-body__aside" data-reveal>
          <p class="eyebrow">Combina com</p>
          <ul>
            <li v-for="t in service.idealFor" :key="t"><AppIcon name="spark" /> {{ t }}</li>
          </ul>
          <a :href="wa" target="_blank" rel="noopener" class="btn btn--wine">Tirar dúvida no WhatsApp</a>
        </aside>
      </div>
    </section>

    <FaqSection :items="faqs" :title="`Dúvidas sobre ${service.name.toLowerCase()}`" id="duvidas-servico" />

    <section class="section section--blush others">
      <div class="container">
        <h2 class="display-md">Outras técnicas</h2>
        <div class="others__grid">
          <NuxtLink v-for="o in others" :key="o.slug" v-tilt="5" :to="`/servicos/${o.slug}`" class="other">
            <LashGlyph v-bind="o.glyph" />
            <span class="other__name">{{ o.name }}</span>
            <span class="other__short">{{ o.short }}</span>
            <span class="other__go">Ver <AppIcon name="arrow" /></span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <LocationSection />
    <FinalCta />
  </div>
</template>

<style scoped>
.svc-hero {
  position: relative; overflow: hidden; color: var(--cream-50);
  background: radial-gradient(120% 90% at 80% 30%, var(--wine-600), var(--wine-800) 55%, var(--wine-950));
  padding: calc(var(--header-h) + clamp(60px, 9vw, 120px)) 0 clamp(80px, 10vw, 140px);
}
.svc-hero__leaves { position: absolute; inset: 0; pointer-events: none; }
.svc-hero__grid { position: relative; z-index: 2; display: grid; grid-template-columns: 1.3fr 1fr; gap: 40px; align-items: center; }
.crumbs { font-size: 13px; opacity: .7; margin-bottom: 28px; display: flex; gap: 8px; flex-wrap: wrap; }
.crumbs a:hover { color: var(--gold-400); }
.svc-hero .eyebrow { color: var(--rose-300); margin-bottom: 22px; }
.svc-hero__title { font-weight: 300; }
.svc-hero__title em { display: block; color: var(--gold-400); font-size: .55em; margin-top: .15em; }
.svc-hero__title :deep(div) { padding-bottom: .05em; }
.svc-hero__lead { margin-top: 26px; max-width: 32rem; font-size: 19px; color: rgba(255, 247, 244, .82); }
.svc-hero__ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }
.svc-hero__glyph { color: var(--rose-200); filter: drop-shadow(0 20px 40px rgba(0, 0, 0, .3)); }

.svc-body { background: var(--cream-50); color: var(--wine-900); }
.svc-body__grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: clamp(40px, 6vw, 100px); align-items: start; }
.svc-body__text { display: grid; gap: 20px; font-size: 18px; color: var(--wine-800); }
.svc-body__text h2 { color: var(--wine-900); margin-bottom: 8px; }
.svc-body__intro { font-family: var(--font-display); font-size: clamp(22px, 2vw, 28px); line-height: 1.35; color: var(--wine-900); }
.svc-body__aside { position: sticky; top: calc(var(--header-h) + 30px); display: grid; gap: 18px; padding: 32px; border-radius: var(--radius-lg); background: var(--blush-100); }
.svc-body__aside .eyebrow { color: var(--wine-600); }
.svc-body__aside ul { display: grid; gap: 12px; font-size: 18px; font-weight: 600; }
.svc-body__aside li { display: flex; gap: 10px; align-items: center; }
.svc-body__aside li .icon { color: var(--gold-500); }

.others { color: var(--wine-900); }
.others__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 40px; }
.other {
  display: grid; gap: 10px; padding: 28px; border-radius: var(--radius-lg); background: var(--cream-50);
  color: var(--wine-900); transition: box-shadow .5s; box-shadow: 0 30px 60px -45px rgba(122, 11, 53, .5);
}
.other:hover { box-shadow: 0 40px 70px -35px rgba(122, 11, 53, .55); }
.other :deep(.glyph) { color: var(--wine-700); width: 70%; }
.other__name { font-family: var(--font-display); font-size: 30px; }
.other__short { font-size: 15px; color: var(--wine-800); opacity: .8; }
.other__go { display: inline-flex; gap: 8px; align-items: center; font-weight: 700; font-size: 14px; color: var(--wine-600); }

@media (max-width: 900px) {
  .svc-hero__grid, .svc-body__grid { grid-template-columns: 1fr; }
  .svc-hero__glyph { max-width: 340px; }
  .svc-body__aside { position: static; }
  .others__grid { grid-template-columns: 1fr; }
}
</style>
