<script setup lang="ts">
import { care } from '#shared/site'

const el = ref<HTMLElement | null>(null)
useMotion(el, ({ gsap }) => {
  gsap.to('.care [data-reveal]', {
    opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07, startAt: { y: 40 },
    scrollTrigger: { trigger: el.value, start: 'top 75%', once: true },
  })
})
</script>

<template>
  <section id="cuidados" ref="el" class="section section--blush care" aria-labelledby="cuidados-title">
    <div class="container care__grid">
      <div class="care__intro">
        <p class="eyebrow" data-reveal>Pós-procedimento</p>
        <h2 id="cuidados-title" class="display-md" data-reveal>Como fazer sua extensão <span class="serif-italic">durar mais</span></h2>
        <p data-reveal>Metade do resultado acontece em casa. Esses cuidados valem pra fio a fio, volume e efeito molhado.</p>
      </div>
      <ol class="care__list">
        <li v-for="(c, i) in care" :key="c.title" class="care__item" data-reveal>
          <span class="care__n">{{ String(i + 1).padStart(2, '0') }}</span>
          <div>
            <h3>{{ c.title }}</h3>
            <p>{{ c.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.care { color: var(--wine-900); }
.care__grid { display: grid; grid-template-columns: 1fr 1.25fr; gap: clamp(40px, 6vw, 100px); align-items: start; }
.care__intro { display: grid; gap: 22px; position: sticky; top: calc(var(--header-h) + 40px); }
.care__intro .eyebrow { color: var(--wine-600); }
.care__intro .serif-italic { color: var(--wine-600); }
.care__intro p:last-child { color: var(--wine-800); opacity: .8; max-width: 26rem; }
.care__list { display: grid; }
.care__item {
  display: grid; grid-template-columns: 64px 1fr; gap: 16px; padding: 26px 8px;
  border-top: 1px solid rgba(122, 11, 53, .15);
  transition: background .5s, padding .5s var(--ease-out);
  border-radius: 4px;
}
.care__item:last-child { border-bottom: 1px solid rgba(122, 11, 53, .15); }
.care__item:hover { background: rgba(255, 247, 244, .7); padding-left: 22px; }
.care__n { font-family: var(--font-display); font-style: italic; font-size: 30px; color: var(--wine-500); line-height: 1; }
.care__item h3 { font-size: 26px; margin-bottom: 6px; }
.care__item p { color: var(--wine-800); opacity: .82; }
@media (max-width: 860px) {
  .care__grid { grid-template-columns: 1fr; }
  .care__intro { position: static; }
}
</style>
