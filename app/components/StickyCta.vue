<script setup lang="ts">
// Barra fixa no celular: aparece depois do hero, some perto do rodapé.
const wa = useWhatsapp()
const show = ref(false)
const onScroll = () => {
  const y = window.scrollY
  const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 420
  show.value = y > window.innerHeight * 0.8 && !nearEnd
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="sticky" :class="{ 'is-on': show }">
    <a :href="wa" target="_blank" rel="noopener" class="btn sticky__btn">
      <AppIcon name="whatsapp" class="btn__icon" /> Agendar meu horário
    </a>
  </div>
</template>

<style scoped>
.sticky {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 90; display: none;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: linear-gradient(transparent, rgba(36, 2, 14, .65) 40%);
  transform: translateY(110%); transition: transform .6s var(--ease-out);
}
.sticky.is-on { transform: none; }
.sticky__btn { width: 100%; box-shadow: 0 12px 30px -10px rgba(0, 0, 0, .5); }
@media (max-width: 760px) { .sticky { display: block; } }
</style>
