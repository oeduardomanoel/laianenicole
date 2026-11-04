<script setup lang="ts">
defineProps<{ items: { name: string, text: string, service?: string }[] }>()
</script>

<template>
  <section class="section section--blush testi" aria-labelledby="testi-title">
    <div class="container">
      <p class="eyebrow">Quem já fez</p>
      <h2 id="testi-title" class="display-md">O que as clientes <span class="serif-italic">contam</span></h2>
      <ul class="testi__grid">
        <li v-for="t in items" :key="t.name" v-tilt="4" class="testi__card">
          <p class="testi__text">“{{ t.text }}”</p>
          <p class="testi__who">{{ t.name }}<span v-if="t.service"> · {{ t.service }}</span></p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.testi { color: var(--wine-900); }
.testi .eyebrow { color: var(--wine-600); margin-bottom: 18px; }
.testi .serif-italic { color: var(--wine-600); }
.testi__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; margin-top: 48px; }
.testi__card { background: var(--cream-50); border-radius: var(--radius-lg); padding: 30px; box-shadow: 0 30px 60px -40px rgba(122, 11, 53, .4); }
.testi__text { font-family: var(--font-display); font-size: 22px; line-height: 1.35; }
.testi__who { margin-top: 18px; font-weight: 700; font-size: 14px; color: var(--wine-600); }
</style>
