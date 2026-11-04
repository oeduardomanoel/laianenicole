<script setup lang="ts">
import { site } from '#shared/site'

const el = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const ready = ref(false)
const wa = useWhatsapp()
const state = { scroll: 0 }
let scene: { start: () => void, stop: () => void, dispose: () => void } | null = null
let io: IntersectionObserver | null = null

onMounted(async () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  try {
    const { createLashScene } = await import('~/lib/lashScene')
    if (!canvas.value) return
    scene = createLashScene(canvas.value, state, { reduced })
    ready.value = true
    io = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? scene?.start() : scene?.stop()), { threshold: 0 })
    io.observe(canvas.value)
  }
  catch (err) {
    // Sem WebGL o hero continua bonito com o gradiente de fundo
    console.warn('[hero] WebGL indisponível', err)
  }
})

useMotion(el, ({ gsap, SplitText }) => {
  const lines = el.value!.querySelectorAll('.hero__line')
  const split = SplitText.create(lines, { type: 'chars', charsClass: 'char' })
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
  tl.from('.hero__kicker', { y: 20, opacity: 0, duration: 1 })
    .from(split.chars, { yPercent: 115, rotate: 6, opacity: 0, duration: 1.3, stagger: 0.028 }, '<0.1')
    .to('[data-hero-fade]', { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, '-=0.9')
    .from('.hero__scroll', { opacity: 0, duration: 1 }, '-=0.6')
  gsap.set('[data-hero-fade]', { y: 26 })

  gsap.timeline({
    scrollTrigger: {
      trigger: el.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: self => (state.scroll = self.progress),
    },
  })
    .to('.hero__inner', { yPercent: -18, opacity: 0.1, ease: 'none' }, 0)
    .to('.hero__glow', { scale: 1.4, opacity: 0.4, ease: 'none' }, 0)
    .to('.hero__halo', { scale: 0.7, opacity: 0, ease: 'none' }, 0)
})

onBeforeUnmount(() => {
  io?.disconnect()
  scene?.dispose()
})
</script>

<template>
  <section id="topo" ref="el" class="hero grain">
    <div class="hero__glow" aria-hidden="true" />
    <div class="hero__halo" aria-hidden="true" />
    <BrushLeaves class="hero__leaves" />
    <canvas ref="canvas" class="hero__canvas" :class="{ 'is-ready': ready }" aria-hidden="true" />

    <div class="container hero__inner">
      <h1 class="hero__title">
        <span class="hero__kicker eyebrow">Extensão de cílios em Balneário Camboriú</span>
        <span class="hero__line display-xl">Acordar com</span>
        <span class="hero__line display-xl">o olhar <em class="hero__accent serif-italic">pronto.</em></span>
      </h1>
      <div class="hero__stroke-wrap" aria-hidden="true"><BrushStroke :delay="1.3" :trigger="false" /></div>

      <p class="hero__lead" data-reveal data-hero-fade>
        Extensão de cílios e lash lifting feitos com calma, um fio de cada vez, no desenho do seu olho.
        Você deita, relaxa e passa semanas sem lembrar que rímel existe.
      </p>

      <div class="hero__ctas" data-reveal data-hero-fade>
        <a v-magnetic :href="wa" class="btn" target="_blank" rel="noopener">
          Agendar pelo WhatsApp <AppIcon name="whatsapp" class="btn__icon" />
        </a>
        <a v-magnetic href="#resultados" class="btn btn--ghost">Ver resultados</a>
      </div>

      <a href="#endereco" class="hero__badge" data-reveal data-hero-fade>
        <span class="hero__pulse" aria-hidden="true" />
        Endereço novo: {{ site.address.street }}, {{ site.address.district }}
      </a>
    </div>

    <div class="hero__scroll" aria-hidden="true">
      <span>role</span>
      <i />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: var(--cream-50);
  background:
    radial-gradient(120% 90% at 75% 40%, var(--wine-600) 0%, var(--wine-700) 30%, var(--wine-800) 60%, var(--wine-950) 100%);
  padding-top: calc(var(--header-h) + 24px);
  padding-bottom: 96px;
}
.hero__glow {
  position: absolute; inset: auto -10% -30% auto; width: 70vw; height: 70vw; border-radius: 50%;
  background: radial-gradient(closest-side, rgba(244, 192, 77, .28), rgba(232, 138, 168, .12) 55%, transparent 70%);
  filter: blur(20px); pointer-events: none;
}
.hero__halo {
  position: absolute; left: 62%; top: 46%; width: min(78vw, 1100px); aspect-ratio: 1.6; transform: translate(-50%, -50%);
  background: radial-gradient(closest-side, rgba(248, 211, 222, .55), rgba(232, 138, 168, .28) 45%, rgba(181, 32, 90, .1) 70%, transparent);
  filter: blur(10px); pointer-events: none; z-index: 0;
}
.hero__leaves { position: absolute; inset: 0; pointer-events: none; }
.hero__canvas {
  position: absolute; inset: 0; width: 100%; height: 100%;
  opacity: 0; transition: opacity 1.6s var(--ease-out);
  z-index: 0;
}
.hero__canvas.is-ready { opacity: 1; }

.hero__inner { position: relative; z-index: 2; }
.hero__title { display: flex; flex-direction: column; font-weight: 300; }
.hero__kicker { color: var(--rose-300); font-family: var(--font-body); margin-bottom: 28px; letter-spacing: .22em; }
.hero__line { display: block; overflow: hidden; padding-bottom: .06em; line-height: .98; }
.hero__line :deep(.char) { display: inline-block; will-change: transform; }
.hero__accent { color: var(--gold-400); font-weight: 300; }
.hero__stroke-wrap { width: min(340px, 52vw); margin: -6px 0 0 clamp(140px, 30vw, 460px); }

.hero__lead { max-width: 30rem; margin-top: 28px; font-size: clamp(17px, 1.3vw, 20px); color: rgba(255, 247, 244, .82); }
.hero__ctas { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 36px; }
.hero__badge {
  display: inline-flex; align-items: center; gap: 12px; margin-top: 44px;
  font-size: 13px; font-weight: 600; letter-spacing: .04em;
  padding: 10px 18px 10px 14px; border-radius: 999px;
  background: rgba(255, 247, 244, .08); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  box-shadow: inset 0 0 0 1px rgba(255, 247, 244, .16);
  transition: background .4s;
}
.hero__badge:hover { background: rgba(255, 247, 244, .16); }
.hero__pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--gold-400); box-shadow: 0 0 0 0 rgba(244, 192, 77, .7); animation: pulse 2s infinite; }
@keyframes pulse { 70% { box-shadow: 0 0 0 10px rgba(244, 192, 77, 0); } 100% { box-shadow: 0 0 0 0 rgba(244, 192, 77, 0); } }

.hero__scroll {
  position: absolute; left: 50%; bottom: 26px; transform: translateX(-50%); z-index: 2;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  font-size: 11px; letter-spacing: .3em; text-transform: uppercase; color: rgba(255, 247, 244, .6);
}
.hero__scroll i { width: 1px; height: 46px; background: linear-gradient(var(--gold-400), transparent); transform-origin: top; animation: drip 2.2s var(--ease-out) infinite; }
@keyframes drip { 0% { transform: scaleY(0); } 50% { transform: scaleY(1); } 100% { transform: scaleY(1); opacity: 0; } }

@media (max-width: 899px) {
  .hero__halo { left: 50%; width: 140vw; }
  .hero { align-items: flex-end; }
  .hero__inner { padding-top: 40svh; }
  .hero__halo { top: 22%; }
  .hero__stroke-wrap { margin-left: 34vw; }
  .hero__scroll { display: none; }
}
</style>
