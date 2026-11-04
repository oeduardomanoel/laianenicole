<script setup lang="ts">
import { services } from '#shared/site'

const el = ref<HTMLElement | null>(null)
let gsapRef: typeof import('gsap').gsap | null = null

useMotion(el, ({ gsap }) => {
  gsapRef = gsap
  gsap.to('.services [data-reveal]', {
    opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, startAt: { y: 40 },
    scrollTrigger: { trigger: '.services__head', start: 'top 80%', once: true },
  })
  gsap.utils.toArray<HTMLElement>('.svc').forEach((card, i) => {
    gsap.fromTo(card, { opacity: 0, y: 80, rotate: i % 2 ? 2 : -2 }, {
      opacity: 1, y: 0, rotate: 0, duration: 1.3, ease: 'expo.out',
      scrollTrigger: { trigger: card, start: 'top 90%', once: true },
    })
  })
})

// No hover os cílios do desenho se redesenham
const redraw = (e: PointerEvent) => {
  if (!gsapRef) return
  const lashes = (e.currentTarget as HTMLElement).querySelectorAll('.glyph__lashes path')
  gsapRef.fromTo(lashes, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out', stagger: 0.006, overwrite: true })
}
</script>

<template>
  <section id="servicos" ref="el" class="section section--deep services grain" aria-labelledby="servicos-title">
    <div class="container">
      <div class="services__head">
        <p class="eyebrow" data-reveal>Técnicas</p>
        <h2 id="servicos-title" class="display-lg" data-reveal>
          Escolha o efeito.<br><span class="serif-italic gold">O resto eu ajusto.</span>
        </h2>
        <p class="services__lead" data-reveal>
          Cada técnica muda o quanto o olhar aparece. Se ficar na dúvida, me manda uma foto sem maquiagem e eu te digo o que combina.
        </p>
      </div>

      <div class="services__grid">
        <article v-for="(s, i) in services" :key="s.slug" v-tilt="6" class="svc" @pointerenter="redraw">
          <NuxtLink :to="`/servicos/${s.slug}`" class="svc__link" :aria-label="`Saiba mais sobre ${s.name}`" />
          <div class="svc__top">
            <span class="svc__num">0{{ i + 1 }}</span>
            <span class="svc__kicker">{{ s.kicker }}</span>
          </div>
          <div class="svc__glyph">
            <LashGlyph v-bind="s.glyph" />
          </div>
          <h3 class="svc__name">{{ s.name }}</h3>
          <p class="svc__short">{{ s.short }}</p>
          <ul class="svc__tags">
            <li v-for="t in s.idealFor" :key="t">{{ t }}</li>
          </ul>
          <span class="svc__more">Ver detalhes <AppIcon name="arrow" /></span>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services { overflow: hidden; }
.services__head { display: grid; gap: 22px; max-width: 760px; margin-bottom: clamp(56px, 7vw, 96px); position: relative; z-index: 2; }
.services__head .eyebrow { color: var(--rose-300); }
.services__lead { color: rgba(255, 247, 244, .75); max-width: 34rem; font-size: 18px; }

.services__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; position: relative; z-index: 2; }
.svc {
  --mx: 50%; --my: 0%;
  position: relative; display: flex; flex-direction: column; gap: 14px;
  padding: 26px 24px 28px; border-radius: var(--radius-lg);
  background:
    radial-gradient(420px circle at var(--mx) var(--my), rgba(244, 192, 77, .16), transparent 45%),
    linear-gradient(160deg, rgba(255, 247, 244, .08), rgba(255, 247, 244, .02));
  box-shadow: inset 0 0 0 1px rgba(255, 247, 244, .12);
  color: var(--cream-50);
  transition: box-shadow .5s, background-color .5s;
  will-change: transform;
}
.svc:hover { box-shadow: inset 0 0 0 1px rgba(244, 192, 77, .5), 0 40px 80px -40px rgba(0, 0, 0, .6); }
.svc__link { position: absolute; inset: 0; z-index: 3; border-radius: inherit; }
.svc__top { display: flex; justify-content: space-between; align-items: center; font-size: 12px; letter-spacing: .2em; text-transform: uppercase; }
.svc__num { color: var(--gold-400); font-weight: 700; }
.svc__kicker { padding: 5px 12px; border-radius: 999px; box-shadow: inset 0 0 0 1px rgba(255, 247, 244, .2); }
.svc__glyph { color: var(--cream-50); padding: 18px 6px 4px; transform: translateZ(40px); transition: color .5s; }
.svc:hover .svc__glyph { color: var(--gold-300); }
.svc__name { font-size: clamp(30px, 2.6vw, 40px); transform: translateZ(30px); }
.svc__short { color: rgba(255, 247, 244, .74); font-size: 15px; line-height: 1.55; }
.svc__tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.svc__tags li { font-size: 12px; padding: 4px 10px; border-radius: 999px; background: rgba(255, 247, 244, .07); }
.svc__more { margin-top: auto; padding-top: 14px; display: inline-flex; align-items: center; gap: 8px; font-weight: 700; font-size: 14px; color: var(--gold-400); }
.svc__more .icon { transition: transform .5s var(--ease-out); }
.svc:hover .svc__more .icon { transform: translateX(6px); }

@media (max-width: 1100px) { .services__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .services__grid { grid-template-columns: 1fr; } }
</style>
