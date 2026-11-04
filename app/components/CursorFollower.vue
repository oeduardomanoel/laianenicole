<script setup lang="ts">
// Cursor personalizado (só em desktop com mouse). Cresce em cima de links e fotos.
const dot = ref<HTMLElement | null>(null)
const label = ref('')
const state = ref<'idle' | 'link' | 'view'>('idle')
let cleanup: (() => void) | null = null

onMounted(async () => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const { gsap } = await import('gsap')
  if (!dot.value) return
  document.documentElement.classList.add('has-cursor')
  const xTo = gsap.quickTo(dot.value, 'x', { duration: 0.45, ease: 'power3' })
  const yTo = gsap.quickTo(dot.value, 'y', { duration: 0.45, ease: 'power3' })
  const move = (e: PointerEvent) => {
    xTo(e.clientX)
    yTo(e.clientY)
    const t = e.target as HTMLElement
    const view = t.closest('[data-cursor]') as HTMLElement | null
    if (view) {
      state.value = 'view'
      label.value = view.dataset.cursor || ''
    }
    else if (t.closest('a, button, summary, [role="button"]')) {
      state.value = 'link'
    }
    else {
      state.value = 'idle'
    }
  }
  window.addEventListener('pointermove', move, { passive: true })
  cleanup = () => window.removeEventListener('pointermove', move)
})
onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="dot" class="cursor" :class="`is-${state}`" aria-hidden="true">
    <span>{{ label }}</span>
  </div>
</template>

<style scoped>
.cursor {
  position: fixed; left: 0; top: 0; z-index: 300; pointer-events: none;
  width: 10px; height: 10px; margin: -5px 0 0 -5px; border-radius: 50%;
  background: var(--gold-400); mix-blend-mode: normal;
  display: none; place-items: center;
  transition: width .45s var(--ease-out), height .45s var(--ease-out), margin .45s var(--ease-out), background .3s, opacity .3s;
}
:global(.has-cursor .cursor) { display: grid; }
.cursor span { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--wine-900); opacity: 0; transition: opacity .3s; }
.cursor.is-link { width: 46px; height: 46px; margin: -23px 0 0 -23px; background: rgba(244, 192, 77, .28); backdrop-filter: blur(2px); }
.cursor.is-view { width: 92px; height: 92px; margin: -46px 0 0 -46px; }
.cursor.is-view span { opacity: 1; }
</style>
