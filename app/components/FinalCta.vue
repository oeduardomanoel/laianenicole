<script setup lang="ts">
const wa = useWhatsapp()
const el = ref<HTMLElement | null>(null)

useMotion(el, ({ gsap, SplitText }) => {
  const split = SplitText.create('.final__title', { type: 'lines,words', linesClass: 'line', mask: 'lines' })
  gsap.from(split.words, {
    yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.05,
    scrollTrigger: { trigger: el.value, start: 'top 70%', once: true },
  })
  gsap.to('.final [data-reveal]', {
    opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, delay: 0.4, startAt: { y: 30 },
    scrollTrigger: { trigger: el.value, start: 'top 70%', once: true },
  })
  gsap.to('.final__ring', { rotate: 360, duration: 18, ease: 'none', repeat: -1 })
})
</script>

<template>
  <section ref="el" class="final" aria-labelledby="final-title">
    <div class="container final__inner">
      <h2 id="final-title" class="final__title display-lg">
        Vamos marcar o <em class="serif-italic">seu horário?</em>
      </h2>
      <p class="final__lead" data-reveal>
        Me chama no WhatsApp, conta qual efeito você quer e eu te passo os horários livres. Tem dúvida antes de decidir? Pode perguntar também.
      </p>
      <div class="final__cta" data-reveal>
        <a v-magnetic="0.4" :href="wa" target="_blank" rel="noopener" class="final__btn" data-cursor="oi!">
          <svg class="final__ring" viewBox="0 0 200 200" aria-hidden="true">
            <defs><path id="ringPath" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
            <text><textPath href="#ringPath">agende pelo whatsapp ✦ agende pelo whatsapp ✦ </textPath></text>
          </svg>
          <span class="final__core"><AppIcon name="whatsapp" /></span>
          <span class="sr-only">Agendar pelo WhatsApp</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.final {
  position: relative; overflow: hidden; color: var(--wine-900);
  background: radial-gradient(90% 120% at 50% 110%, var(--rose-300), var(--blush-100) 55%, var(--cream-50));
  padding-block: clamp(100px, 14vw, 200px);
}
.final__inner { display: grid; justify-items: center; text-align: center; gap: 28px; }
.final__title { max-width: 14ch; }
.final__title em { color: var(--wine-600); }
.final__title :deep(.line) { padding-bottom: .08em; }
.final__lead { max-width: 34rem; color: var(--wine-800); opacity: .85; font-size: 18px; }
.final__cta { margin-top: 20px; }
.final__btn { position: relative; display: grid; place-items: center; width: 200px; height: 200px; }
.final__ring { position: absolute; inset: 0; width: 100%; height: 100%; }
.final__ring text { font-size: 15px; font-weight: 700; letter-spacing: .32em; text-transform: uppercase; fill: var(--wine-700); }
.final__core {
  width: 116px; height: 116px; border-radius: 50%; display: grid; place-items: center;
  background: var(--wine-700); color: var(--cream-50);
  transition: transform .6s var(--ease-out), background .4s, box-shadow .6s;
  box-shadow: 0 20px 50px -18px rgba(122, 11, 53, .7);
}
.final__core .icon { width: 44px; height: 44px; }
.final__btn:hover .final__core { transform: scale(1.12); background: var(--gold-400); color: var(--wine-900); box-shadow: 0 30px 60px -20px rgba(227, 164, 43, .8); }
</style>
