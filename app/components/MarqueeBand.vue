<script setup lang="ts">
import { marquee } from '#shared/site'

const el = ref<HTMLElement | null>(null)

useMotion(el, ({ gsap, ScrollTrigger }) => {
  const rows = gsap.utils.toArray<HTMLElement>('.marquee__track')
  const tweens = rows.map((row, i) =>
    gsap.to(row, { xPercent: i % 2 ? 0 : -50, startAt: { xPercent: i % 2 ? -50 : 0 }, duration: 38, ease: 'none', repeat: -1 }),
  )
  // A velocidade da rolagem acelera a faixa e dá uma leve inclinação
  const skewTo = gsap.quickTo('.marquee__inner', 'skewX', { duration: 0.5, ease: 'power3' })
  let settle: gsap.core.Tween | null = null
  ScrollTrigger.create({
    trigger: el.value,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const v = self.getVelocity()
      const boost = 1 + Math.min(Math.abs(v) / 400, 4)
      tweens.forEach(t => gsap.to(t, { timeScale: boost, duration: 0.3, overwrite: true }))
      skewTo(gsap.utils.clamp(-6, 6, v / -300))
      settle?.kill()
      settle = gsap.delayedCall(0.18, () => {
        tweens.forEach(t => gsap.to(t, { timeScale: 1, duration: 0.8, overwrite: true }))
        skewTo(0)
      })
    },
  })
})
</script>

<template>
  <section ref="el" class="marquee" aria-label="Técnicas">
    <div class="marquee__inner">
      <div v-for="r in 2" :key="r" class="marquee__row">
        <div class="marquee__track">
          <template v-for="n in 2" :key="n">
            <span v-for="item in marquee" :key="`${n}-${item}`" class="marquee__item">
              {{ item }} <AppIcon name="spark" class="marquee__spark" />
            </span>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee { position: relative; z-index: 3; margin-top: -40px; transform: rotate(-2deg); pointer-events: none; }
.marquee__inner { background: var(--gold-400); color: var(--wine-900); padding: 14px 0; box-shadow: 0 30px 60px -30px rgba(36, 2, 14, .6); }
.marquee__row { overflow: hidden; }
.marquee__row + .marquee__row { border-top: 1px solid rgba(58, 5, 23, .15); padding-top: 8px; margin-top: 8px; }
.marquee__row:nth-child(2) .marquee__item { font-style: italic; font-weight: 300; opacity: .9; }
.marquee__track { display: flex; width: max-content; will-change: transform; }
.marquee__item {
  display: inline-flex; align-items: center; gap: 28px; padding-right: 28px;
  font-family: var(--font-display); font-size: clamp(26px, 3.4vw, 46px); line-height: 1.1; white-space: nowrap;
}
.marquee__spark { width: .55em; height: .55em; color: var(--wine-700); }
</style>
