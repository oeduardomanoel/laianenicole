<script setup lang="ts">
import { services, site } from '#shared/site'

interface Post { id: string, permalink: string, image: string, caption: string, alt: string, isVideo: boolean }

const el = ref<HTMLElement | null>(null)
const { data, status } = useFetch<{ posts: Post[], source: string }>('/api/instagram', { server: false, lazy: true })
const posts = computed(() => (data.value?.posts ?? []).slice(0, 10))
const hasPosts = computed(() => posts.value.length > 0)

// Enquanto as fotos não chegam (ou se o Instagram bloquear), mostra cards da identidade visual
const placeholders = computed(() => [
  ...services.map(s => ({ title: s.name, glyph: s.glyph })),
  { title: 'Manutenção', glyph: { density: 30, length: 0.86, curl: 0.55, fan: 1 } },
  { title: 'Remoção segura', glyph: { density: 18, length: 0.7, curl: 0.4, fan: 1 } },
  { title: '@' + site.handle, glyph: { density: 38, length: 0.9, curl: 0.6, fan: 2 } },
])

const clean = (c: string) => c.replace(/#[\p{L}\d_]+/gu, '').replace(/\s+/g, ' ').trim().slice(0, 110)

let gsapMod: typeof import('gsap') | null = null
let stMod: typeof import('gsap/ScrollTrigger') | null = null

const animateTiles = () => {
  if (!gsapMod || !el.value) return
  const { gsap } = gsapMod
  const tiles = el.value.querySelectorAll<HTMLElement>('.tile:not(.is-in)')
  tiles.forEach((tile, i) => {
    tile.classList.add('is-in')
    gsap.fromTo(tile, { clipPath: 'inset(100% 0% 0% 0% round 28px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.4, ease: 'expo.out', delay: (i % 3) * 0.08,
      scrollTrigger: { trigger: tile, start: 'top 92%', once: true },
    })
    const media = tile.querySelector('.tile__media')
    if (media) {
      gsap.fromTo(media, { yPercent: -8, scale: 1.18 }, {
        yPercent: 8, scale: 1.18, ease: 'none',
        scrollTrigger: { trigger: tile, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }
  })
  stMod?.ScrollTrigger.refresh()
}

useMotion(el, ({ gsap }) => {
  gsap.to('.gallery [data-reveal]', {
    opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, startAt: { y: 40 },
    scrollTrigger: { trigger: el.value, start: 'top 75%', once: true },
  })
})

onMounted(async () => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsapMod = await import('gsap')
  stMod = await import('gsap/ScrollTrigger')
  nextTick(animateTiles)
})
watch([posts, status], () => nextTick(animateTiles))
</script>

<template>
  <section id="resultados" ref="el" class="section gallery" aria-labelledby="resultados-title">
    <div class="container">
      <div class="gallery__head">
        <div>
          <p class="eyebrow" data-reveal>Resultados</p>
          <h2 id="resultados-title" class="display-lg" data-reveal>
            Olhares que <span class="serif-italic">saíram daqui</span>
          </h2>
        </div>
        <p class="gallery__lead" data-reveal>
          Fotos das clientes, direto do Instagram. Sem filtro de beleza, porque cílio bom aparece sozinho.
        </p>
      </div>

      <ClientOnly>
        <div v-if="hasPosts" class="gallery__grid">
          <a
            v-for="(p, i) in posts" :key="p.id" :href="p.permalink" target="_blank" rel="noopener"
            class="tile" :class="{ 'tile--tall': i === 0 || i === 6 }" data-cursor="ver"
          >
            <img class="tile__media" :src="p.image" :alt="p.alt" loading="lazy" decoding="async" referrerpolicy="no-referrer">
            <span class="tile__overlay">
              <AppIcon name="instagram" />
              <span v-if="clean(p.caption)" class="tile__caption">{{ clean(p.caption) }}…</span>
            </span>
          </a>
        </div>
        <div v-else class="gallery__grid" :aria-busy="status === 'pending'">
          <a
            v-for="(ph, i) in placeholders" :key="ph.title" :href="site.instagram" target="_blank" rel="noopener"
            class="tile tile--ph" :class="{ 'tile--tall': i === 0 || i === 3 }" data-cursor="ver"
          >
            <span class="tile__media tile__ph-bg" />
            <span class="tile__ph">
              <LashGlyph v-bind="ph.glyph" />
              <span class="tile__ph-title">{{ ph.title }}</span>
            </span>
          </a>
        </div>
        <template #fallback>
          <div class="gallery__grid gallery__grid--skeleton">
            <span v-for="n in 7" :key="n" class="tile tile--skeleton" />
          </div>
        </template>
      </ClientOnly>

      <div class="gallery__foot" data-reveal>
        <a v-magnetic :href="site.instagram" target="_blank" rel="noopener" class="btn btn--wine">
          <AppIcon name="instagram" class="btn__icon" /> Ver mais no @{{ site.handle }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery { background: var(--cream-50); }
.gallery__head { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; flex-wrap: wrap; margin-bottom: 56px; }
.gallery__head .eyebrow { color: var(--wine-600); margin-bottom: 20px; }
.gallery__head h2 { color: var(--wine-900); }
.gallery__head .serif-italic { color: var(--wine-600); }
.gallery__lead { max-width: 24rem; color: var(--wine-800); opacity: .8; }

.gallery__grid { grid-auto-flow: dense; display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: clamp(220px, 26vw, 380px); gap: 16px; }
.tile {
  position: relative; overflow: hidden; border-radius: 28px; background: var(--wine-800); display: block;
  isolation: isolate;
}
.tile--tall { grid-row: span 2; }
.tile__media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: filter .6s; }
.tile__overlay {
  position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; justify-content: flex-end; gap: 10px;
  padding: 22px; color: var(--cream-50);
  background: linear-gradient(transparent 40%, rgba(36, 2, 14, .82));
  opacity: 0; transition: opacity .5s var(--ease-out);
}
.tile__overlay .icon { width: 26px; height: 26px; transform: translateY(10px); transition: transform .6s var(--ease-out); }
.tile__caption { font-size: 14px; line-height: 1.45; transform: translateY(14px); transition: transform .6s var(--ease-out); }
.tile:hover .tile__overlay, .tile:focus-visible .tile__overlay { opacity: 1; }
.tile:hover .tile__overlay .icon, .tile:hover .tile__caption { transform: none; }
.tile:hover .tile__media { filter: saturate(1.1) contrast(1.05); }

.tile__ph-bg {
  background:
    radial-gradient(80% 60% at 30% 20%, rgba(244, 192, 77, .22), transparent 60%),
    radial-gradient(90% 80% at 80% 100%, var(--wine-500), transparent 60%),
    linear-gradient(160deg, var(--wine-700), var(--wine-900));
}
.tile__ph { position: absolute; inset: 0; z-index: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 26px; color: var(--cream-50); }
.tile__ph :deep(.glyph) { width: 70%; margin: auto; opacity: .9; transition: transform .8s var(--ease-out), color .5s; }
.tile--ph:hover :deep(.glyph) { transform: scale(1.08) rotate(-3deg); color: var(--gold-300); }
.tile__ph-title { font-family: var(--font-display); font-size: 28px; }
.tile--skeleton { background: linear-gradient(90deg, var(--blush-100), var(--rose-200), var(--blush-100)); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
.gallery__grid--skeleton .tile:nth-child(1), .gallery__grid--skeleton .tile:nth-child(4) { grid-row: span 2; }
@keyframes shimmer { to { background-position: -200% 0; } }

.gallery__foot { display: flex; justify-content: center; margin-top: 48px; }

@media (max-width: 760px) {
  .gallery__grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 210px; gap: 10px; }
  .tile { border-radius: 20px; }
  .tile__overlay { opacity: 1; background: linear-gradient(transparent 55%, rgba(36, 2, 14, .7)); }
  .tile__caption { display: none; }
  .tile__ph-title { font-size: 20px; }
  .tile__ph { padding: 16px; }
  .tile--ph:nth-child(7), .tile--skeleton:nth-child(7) { display: none; }
}
</style>
