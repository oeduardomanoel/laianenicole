<script setup lang="ts">
// Desenho vetorial de um olho com cílios, gerado pelos parâmetros de cada técnica.
const props = withDefaults(defineProps<{ density?: number, length?: number, curl?: number, fan?: number }>(), {
  density: 26, length: 0.8, curl: 0.5, fan: 1,
})

const paths = computed(() => {
  const out: { d: string, w: number, i: number }[] = []
  const lid = (u: number) => {
    // Pálpebra superior: arco de (24,78) a (196,74)
    const x = 24 + u * 172
    const y = 78 - Math.sin(u * Math.PI) * 30 - u * 4
    return { x, y }
  }
  for (let i = 0; i < props.density; i++) {
    const u = 0.04 + (i / (props.density - 1)) * 0.92
    const { x, y } = lid(u)
    // Comprimento cresce pro canto externo (efeito gatinho)
    const L = (14 + 30 * Math.pow(u, 1.2)) * props.length * (1 - 0.25 * Math.max(0, u - 0.9) * 10)
    const lean = (u - 0.42) * 1.3
    for (let f = 0; f < props.fan; f++) {
      const spread = props.fan === 1 ? 0 : (f - (props.fan - 1) / 2) * 0.22
      const ang = -Math.PI / 2 + lean + spread
      const wet = props.fan === 3
      const ex = x + Math.cos(-Math.PI / 2 + lean) * L * (wet ? 1 : 1) + (wet ? 0 : Math.cos(ang) * 2)
      const ey = y + Math.sin(-Math.PI / 2 + lean) * L
      const cx = x + Math.cos(ang) * L * 0.5 + L * props.curl * 0.5
      const cy = y + Math.sin(ang) * L * 0.3 - 2
      const tipX = wet ? ex : x + Math.cos(ang) * L + L * props.curl * 0.35
      const tipY = wet ? ey : y + Math.sin(ang) * L * 0.95
      out.push({ d: `M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}`, w: props.fan > 1 ? 1.1 : 1.5, i: out.length })
    }
  }
  return out
})
</script>

<template>
  <svg class="glyph" viewBox="0 0 220 110" fill="none" aria-hidden="true">
    <path class="glyph__lid" d="M22 79 Q110 22 198 75" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" />
    <path class="glyph__lower" d="M40 82 Q110 108 186 78" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity=".35" />
    <g class="glyph__lashes">
      <path v-for="p in paths" :key="p.i" :d="p.d" :stroke-width="p.w" stroke="currentColor" stroke-linecap="round" pathLength="1" :style="{ '--i': p.i }" />
    </g>
  </svg>
</template>

<style scoped>
.glyph { width: 100%; height: auto; overflow: visible; }
.glyph__lashes path {
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
}
</style>
