<script setup lang="ts">
import { steps } from '#shared/site'

const el = ref<HTMLElement | null>(null)

useMotion(el, ({ gsap }) => {
  const mm = gsap.matchMedia()
  mm.add('(min-width: 900px)', () => {
    const track = el.value!.querySelector<HTMLElement>('.process__track')!
    const distance = () => track.scrollWidth - window.innerWidth + 80
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.process__pin',
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    })
    gsap.to('.process__bar i', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '.process__pin', start: 'top top', end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
    })
    gsap.utils.toArray<HTMLElement>('.step:not(.step--end)').forEach((step) => {
      gsap.from(step.querySelectorAll('.step__n, .step__title, .step__text'), {
        y: 60, opacity: 0, stagger: 0.08, ease: 'expo.out', duration: 1,
        scrollTrigger: { trigger: step, containerAnimation: tween, start: 'left 85%', toggleActions: 'play none none reverse' },
      })
    })
  })
  mm.add('(max-width: 899px)', () => {
    gsap.utils.toArray<HTMLElement>('.step').forEach((step) => {
      gsap.from(step, { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: step, start: 'top 88%', once: true } })
    })
  })
})
</script>

<template>
  <section id="como-funciona" ref="el" class="process section--deep grain" aria-labelledby="processo-title">
    <div class="process__pin">
      <div class="container process__head">
        <p class="eyebrow">Como funciona</p>
        <h2 id="processo-title" class="display-md">Do primeiro oi <span class="serif-italic gold">até o espelho</span></h2>
        <div class="process__bar" aria-hidden="true"><i /></div>
      </div>
      <ol class="process__track">
        <li v-for="s in steps" :key="s.n" class="step">
          <span class="step__n">{{ s.n }}</span>
          <h3 class="step__title">{{ s.title }}</h3>
          <p class="step__text">{{ s.text }}</p>
        </li>
        <li class="step step--end" aria-hidden="true">
          <LashGlyph :density="40" :length="0.95" :curl="0.6" :fan="2" />
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.process { position: relative; overflow: hidden; }
.process__pin { min-height: 100svh; display: flex; flex-direction: column; justify-content: center; padding-block: 120px 80px; position: relative; z-index: 2; }
.process__head { display: grid; gap: 18px; margin-bottom: 64px; }
.process__head .eyebrow { color: var(--rose-300); }
.process__bar { height: 2px; background: rgba(255, 247, 244, .12); margin-top: 20px; max-width: 420px; border-radius: 2px; overflow: hidden; }
.process__bar i { display: block; height: 100%; background: var(--gold-400); transform: scaleX(0); transform-origin: left; }

.process__track { display: flex; gap: 22px; padding-left: max(var(--gutter), calc((100vw - var(--max)) / 2)); padding-right: 10vw; width: max-content; will-change: transform; }
.step {
  width: clamp(300px, 30vw, 440px); min-height: 360px; flex: none;
  padding: 34px 32px; border-radius: var(--radius-lg);
  background: linear-gradient(170deg, rgba(255, 247, 244, .08), rgba(255, 247, 244, .015));
  box-shadow: inset 0 0 0 1px rgba(255, 247, 244, .1);
  display: flex; flex-direction: column; gap: 18px;
  transition: box-shadow .5s, transform .6s var(--ease-out);
}
.step:hover { box-shadow: inset 0 0 0 1px rgba(244, 192, 77, .45); transform: translateY(-6px); }
.step__n { font-family: var(--font-display); font-style: italic; font-weight: 300; font-size: 88px; line-height: .9; color: var(--gold-400); }
.step__title { font-size: 36px; margin-top: auto; }
.step__text { color: rgba(255, 247, 244, .74); }
.step--end { display: grid; place-items: center; background: none; box-shadow: none; color: var(--rose-300); }
.step--end:hover { transform: none; box-shadow: none; }
.step--end :deep(.glyph) { width: 80%; }

@media (max-width: 899px) {
  .process__pin { padding-block: 96px; }
  .process__track { flex-direction: column; width: auto; padding-inline: var(--gutter); }
  .step { width: 100%; min-height: 0; }
  .step__n { font-size: 64px; }
  .step__title { margin-top: 8px; font-size: 30px; }
  .step--end { display: none; }
}
</style>
