<script setup lang="ts">
import { fullAddress, site } from '#shared/site'

const wa = useWhatsapp()
const el = ref<HTMLElement | null>(null)
const showMap = ref(false)
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
const embed = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`
const moved = new Date(`${site.movedAt}T12:00:00`).toLocaleDateString('pt-BR')

useMotion(el, ({ gsap }) => {
  gsap.to('.location [data-reveal]', {
    opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, startAt: { y: 40 },
    scrollTrigger: { trigger: el.value, start: 'top 75%', once: true, onEnter: () => (showMap.value = true) },
  })
  gsap.fromTo('.location__map', { clipPath: 'inset(12% 12% 12% 12% round 40px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 36px)', ease: 'none',
    scrollTrigger: { trigger: '.location__map', start: 'top bottom', end: 'center center', scrub: true },
  })
})
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) showMap.value = true
})
</script>

<template>
  <section id="endereco" ref="el" class="section section--wine location grain" aria-labelledby="endereco-title">
    <BrushLeaves class="location__leaves" />
    <div class="container location__grid">
      <div class="location__info">
        <p class="location__alert" data-reveal><AppIcon name="spark" /> Atenção: endereço novo desde {{ moved }}</p>
        <h2 id="endereco-title" class="display-md" data-reveal>
          Agora estou no <span class="serif-italic gold">bairro Nações</span>
        </h2>
        <div class="location__stroke" data-reveal><BrushStroke /></div>
        <address class="location__address" data-reveal>
          <AppIcon name="pin" />
          <span>{{ site.address.street }}<br>Nações, {{ site.address.city }} · {{ site.address.state }}</span>
        </address>
        <p class="location__hours" data-reveal><AppIcon name="clock" /> {{ site.hours }}</p>
        <div class="location__ctas" data-reveal>
          <a v-magnetic :href="mapsLink" target="_blank" rel="noopener" class="btn">Como chegar <AppIcon name="arrow" class="btn__icon" /></a>
          <a v-magnetic :href="wa" target="_blank" rel="noopener" class="btn btn--ghost">Agendar</a>
        </div>
      </div>
      <div class="location__map">
        <iframe
          v-if="showMap" :src="embed" title="Mapa: Rua Itália, 121, Nações, Balneário Camboriú"
          loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen
        />
        <a v-else :href="mapsLink" target="_blank" rel="noopener" class="location__map-ph">Abrir mapa</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.location { overflow: hidden; }
.location__leaves { position: absolute; inset: 0; opacity: .7; pointer-events: none; }
.location__grid { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr 1.1fr; gap: clamp(40px, 6vw, 90px); align-items: center; }
.location__info { display: grid; gap: 22px; }
.location__alert {
  justify-self: start; display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px; border-radius: 999px; background: var(--gold-400); color: var(--wine-900);
  font-size: 13px; font-weight: 700; letter-spacing: .04em;
}
.location__stroke { width: min(300px, 70%); margin-top: -10px; }
.location__address, .location__hours { display: flex; gap: 14px; align-items: flex-start; font-style: normal; font-size: 19px; line-height: 1.5; }
.location__address .icon, .location__hours .icon { color: var(--gold-400); margin-top: 4px; }
.location__hours { font-size: 16px; opacity: .85; }
.location__ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px; }
.location__map { aspect-ratio: 4 / 3.4; border-radius: 36px; overflow: hidden; background: radial-gradient(circle at 50% 45%, var(--wine-700), var(--wine-900) 70%); box-shadow: 0 40px 80px -40px rgba(0, 0, 0, .6); }
.location__map iframe { width: 100%; height: 100%; border: 0; filter: saturate(.85) contrast(1.05); }
.location__map-ph { display: grid; place-items: center; height: 100%; color: var(--rose-300); }
@media (max-width: 860px) { .location__grid { grid-template-columns: 1fr; } }
</style>
