<script setup lang="ts">
const el = ref<HTMLElement | null>(null)

useMotion(el, ({ gsap, SplitText }) => {
  const split = SplitText.create('.manifesto__text', { type: 'words', wordsClass: 'w' })
  gsap.fromTo(split.words, { opacity: 0.12 }, {
    opacity: 1,
    ease: 'none',
    stagger: 0.08,
    scrollTrigger: { trigger: '.manifesto__text', start: 'top 80%', end: 'bottom 45%', scrub: true },
  })
  gsap.to('[data-reveal]', {
    opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1,
    startAt: { y: 30 },
    scrollTrigger: { trigger: el.value, start: 'top 75%', once: true },
  })
  gsap.to('.manifesto__orb', {
    yPercent: -40, ease: 'none',
    scrollTrigger: { trigger: el.value, start: 'top bottom', end: 'bottom top', scrub: true },
  })
})
</script>

<template>
  <section ref="el" class="section manifesto" aria-labelledby="manifesto-title">
    <div class="manifesto__orb" aria-hidden="true" />
    <div class="container manifesto__inner">
      <p id="manifesto-title" class="eyebrow manifesto__eyebrow" data-reveal>Antes do primeiro fio</p>
      <p class="manifesto__text">
        Cílio bonito é o que combina com você. Antes de começar, eu olho o formato do seu olho, a sua rotina e o quanto você quer aparecer.
        Às vezes a resposta é volume. Às vezes é um fio a fio que ninguém percebe, só sente que você está diferente.
      </p>
      <p class="manifesto__sign" data-reveal>
        <span class="serif-italic">Laiane Nicole</span>
        <span class="manifesto__role">lash designer</span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.manifesto { background: var(--cream-50); overflow: hidden; padding-top: clamp(140px, 16vw, 220px); }
.manifesto__orb {
  position: absolute; right: -12vw; top: 10%; width: 46vw; height: 46vw; border-radius: 50%;
  background: radial-gradient(closest-side, var(--rose-200), transparent 70%); opacity: .8; pointer-events: none;
}
.manifesto__inner { position: relative; max-width: 1120px; }
.manifesto__eyebrow { color: var(--wine-600); margin-bottom: 36px; }
.manifesto__text {
  font-family: var(--font-display); font-weight: 300;
  font-size: clamp(30px, 4.3vw, 64px); line-height: 1.12; letter-spacing: -0.02em; color: var(--wine-900);
}
.manifesto__text :deep(.w) { display: inline-block; }
.manifesto__sign { margin-top: 48px; display: flex; align-items: baseline; gap: 16px; }
.manifesto__sign .serif-italic { font-size: 34px; color: var(--wine-600); }
.manifesto__role { font-size: 12px; letter-spacing: .26em; text-transform: uppercase; color: var(--wine-700); opacity: .7; }
</style>
