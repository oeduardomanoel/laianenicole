<script setup lang="ts">
// Rabisco dourado de pincel, igual ao dos stories. Desenha sozinho quando entra na tela.
const el = ref<SVGSVGElement | null>(null)
const props = withDefaults(defineProps<{ delay?: number, trigger?: boolean }>(), { delay: 0, trigger: true })

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  if (!el.value) return
  const paths = el.value.querySelectorAll('path')
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  paths.forEach((p) => {
    const len = (p as SVGPathElement).getTotalLength()
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
  })
  gsap.to(paths, {
    strokeDashoffset: 0,
    duration: 1.1,
    ease: 'power2.inOut',
    stagger: 0.18,
    delay: props.delay,
    scrollTrigger: props.trigger ? { trigger: el.value, start: 'top 92%', once: true } : undefined,
  })
  void ScrollTrigger
})
</script>

<template>
  <svg ref="el" class="brush" viewBox="0 0 320 40" fill="none" preserveAspectRatio="none" aria-hidden="true">
    <path d="M6 18c58-9 140-13 208-10 34 1.5 66 4 98 7" stroke="currentColor" stroke-width="7" stroke-linecap="round" />
    <path d="M30 31c52-7 118-9 170-7 28 1 52 2.5 78 5" stroke="currentColor" stroke-width="5" stroke-linecap="round" opacity=".85" />
  </svg>
</template>

<style scoped>
.brush { color: var(--gold-400); width: 100%; height: auto; overflow: visible; }
</style>
