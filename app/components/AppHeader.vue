<script setup lang="ts">
const wa = useWhatsapp()
const open = ref(false)
const scrolled = ref(false)
const hidden = ref(false)
const route = useRoute()

const links = [
  { href: '/#servicos', label: 'Técnicas' },
  { href: '/#resultados', label: 'Resultados' },
  { href: '/#como-funciona', label: 'Como funciona' },
  { href: '/#duvidas', label: 'Dúvidas' },
  { href: '/#endereco', label: 'Endereço' },
]

let lastY = 0
const onScroll = () => {
  const y = window.scrollY
  scrolled.value = y > 40
  hidden.value = y > 500 && y > lastY && !open.value
  lastY = y
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
watch(() => route.fullPath, () => (open.value = false))
watch(open, (v) => {
  if (import.meta.client) document.documentElement.classList.toggle('menu-open', v)
})
</script>

<template>
  <header class="header" :class="{ 'is-scrolled': scrolled, 'is-hidden': hidden, 'is-open': open }">
    <div class="container header__bar">
      <NuxtLink to="/" class="logo" aria-label="Laiane Nicole, página inicial">
        <span class="logo__name">Laiane <em>Nicole</em></span>
        <span class="logo__role">lash designer</span>
      </NuxtLink>

      <nav class="nav" aria-label="Principal">
        <a v-for="l in links" :key="l.href" :href="l.href" class="nav__link">{{ l.label }}</a>
      </nav>

      <a v-magnetic="0.25" :href="wa" class="btn header__cta" target="_blank" rel="noopener">Agendar</a>

      <button class="burger" :aria-expanded="open" aria-controls="menu-mobile" @click="open = !open">
        <span class="sr-only">{{ open ? 'Fechar menu' : 'Abrir menu' }}</span>
        <i /><i />
      </button>
    </div>

    <div id="menu-mobile" class="drawer" :aria-hidden="!open">
      <nav class="container drawer__nav" aria-label="Menu">
        <a v-for="(l, i) in links" :key="l.href" :href="l.href" :style="{ '--d': `${i * 60}ms` }" @click="open = false">{{ l.label }}</a>
        <a :href="wa" class="btn drawer__cta" target="_blank" rel="noopener" :style="{ '--d': '320ms' }">
          Agendar pelo WhatsApp <AppIcon name="whatsapp" class="btn__icon" />
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed; inset: 0 0 auto; z-index: 100; color: var(--cream-50);
  transition: transform .6s var(--ease-out), background .5s, box-shadow .5s;
}
.header.is-hidden { transform: translateY(-110%); }
.header.is-scrolled {
  background: rgba(58, 5, 23, .72);
  backdrop-filter: blur(14px) saturate(1.3); -webkit-backdrop-filter: blur(14px) saturate(1.3);
  box-shadow: 0 1px 0 rgba(255, 247, 244, .08);
}
.header__bar { height: var(--header-h); display: flex; align-items: center; gap: 28px; }

.logo { display: flex; flex-direction: column; line-height: 1; margin-right: auto; position: relative; z-index: 2; }
.logo__name { font-family: var(--font-display); font-size: 25px; letter-spacing: -0.01em; }
.logo__name em { font-style: italic; font-weight: 300; color: var(--gold-400); }
.logo__role { font-size: 10px; letter-spacing: .34em; text-transform: uppercase; opacity: .7; margin-top: 4px; }

.nav { display: flex; gap: 26px; }
.nav__link { font-size: 14px; font-weight: 600; opacity: .82; position: relative; transition: opacity .3s; }
.nav__link::after { content: ''; position: absolute; left: 0; right: 0; bottom: -6px; height: 1px; background: var(--gold-400); transform: scaleX(0); transform-origin: right; transition: transform .5s var(--ease-out); }
.nav__link:hover { opacity: 1; }
.nav__link:hover::after { transform: scaleX(1); transform-origin: left; }

.header__cta { min-height: 44px; padding: 0 22px; font-size: 14px; }

.burger { display: none; width: 44px; height: 44px; position: relative; z-index: 2; border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(255, 247, 244, .3); }
.burger i { position: absolute; left: 13px; right: 13px; height: 1.5px; background: currentColor; transition: transform .5s var(--ease-out); }
.burger i:first-of-type { top: 18px; }
.burger i:last-of-type { top: 25px; }
.is-open .burger i:first-of-type { transform: translateY(3.5px) rotate(45deg); }
.is-open .burger i:last-of-type { transform: translateY(-3.5px) rotate(-45deg); }

.drawer {
  position: fixed; inset: 0; z-index: 1; background: var(--wine-900);
  clip-path: circle(0% at calc(100% - 40px) 38px);
  transition: clip-path .8s var(--ease-out); visibility: hidden;
}
.is-open .drawer { clip-path: circle(150% at calc(100% - 40px) 38px); visibility: visible; }
.drawer__nav { display: flex; flex-direction: column; gap: 6px; padding-top: calc(var(--header-h) + 40px); }
.drawer__nav a:not(.btn) {
  font-family: var(--font-display); font-size: 44px; line-height: 1.2;
  opacity: 0; transform: translateY(20px); transition: opacity .5s, transform .6s var(--ease-out);
  transition-delay: var(--d);
}
.drawer__cta { margin-top: 28px; align-self: flex-start; opacity: 0; transform: translateY(20px); transition: opacity .5s, transform .6s var(--ease-out); transition-delay: var(--d); }
.is-open .drawer__nav a { opacity: 1; transform: none; }

@media (max-width: 960px) {
  .nav, .header__cta { display: none; }
  .burger { display: block; }
}
</style>
