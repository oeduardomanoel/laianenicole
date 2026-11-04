<script setup lang="ts">
import { fullAddress, services, site } from '#shared/site'

const wa = useWhatsapp()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        <p class="footer__logo">Laiane <em>Nicole</em></p>
        <p class="footer__tag">Lash designer em Balneário Camboriú. Extensão de cílios e lash lifting com hora marcada.</p>
        <div class="footer__social">
          <a :href="site.instagram" target="_blank" rel="noopener" aria-label="Instagram @llaianelash"><AppIcon name="instagram" /></a>
          <a :href="wa" target="_blank" rel="noopener" aria-label="WhatsApp"><AppIcon name="whatsapp" /></a>
        </div>
      </div>

      <div>
        <p class="footer__title">Técnicas</p>
        <ul>
          <li v-for="s in services" :key="s.slug"><NuxtLink :to="`/servicos/${s.slug}`" class="link-underline">{{ s.name }}</NuxtLink></li>
        </ul>
      </div>

      <div>
        <p class="footer__title">Onde estou</p>
        <address>
          {{ site.address.street }}<br>
          Bairro {{ site.address.district }}<br>
          {{ site.address.city }} · {{ site.address.state }}
        </address>
        <a :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`" target="_blank" rel="noopener" class="link-underline footer__map">Abrir no Google Maps</a>
      </div>

      <div>
        <p class="footer__title">Contato</p>
        <ul>
          <li><a :href="wa" target="_blank" rel="noopener" class="link-underline">WhatsApp</a></li>
          <li><a :href="site.instagram" target="_blank" rel="noopener" class="link-underline">@{{ site.handle }}</a></li>
          <li>{{ site.hours }}</li>
        </ul>
      </div>
    </div>

    <div class="container footer__big" aria-hidden="true">Laiane Nicole</div>

    <div class="container footer__bottom">
      <span>© {{ year }} {{ site.brand }}</span>
      <a href="#topo" class="link-underline">Voltar ao topo ↑</a>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: var(--wine-950); color: rgba(255, 247, 244, .78); padding-top: 96px; overflow: hidden; }
.footer__grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 40px; }
.footer__logo { font-family: var(--font-display); font-size: 34px; color: var(--cream-50); }
.footer__logo em { font-style: italic; font-weight: 300; color: var(--gold-400); }
.footer__tag { margin-top: 12px; max-width: 22rem; font-size: 15px; }
.footer__social { display: flex; gap: 10px; margin-top: 22px; }
.footer__social a {
  width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; color: var(--cream-50);
  box-shadow: inset 0 0 0 1px rgba(255, 247, 244, .2); transition: background .4s, color .4s, transform .5s var(--ease-out);
}
.footer__social a:hover { background: var(--gold-400); color: var(--wine-900); transform: translateY(-3px); }
.footer__title { font-size: 12px; letter-spacing: .24em; text-transform: uppercase; color: var(--gold-400); font-weight: 700; margin-bottom: 16px; }
.footer ul { display: grid; gap: 8px; font-size: 15px; }
address { font-style: normal; font-size: 15px; line-height: 1.7; }
.footer__map { display: inline-block; margin-top: 10px; font-size: 14px; color: var(--cream-50); }
.footer__big {
  font-family: var(--font-display); font-style: italic; font-weight: 300;
  font-size: clamp(64px, 15vw, 240px); line-height: .9; white-space: nowrap; letter-spacing: -0.04em;
  color: transparent; -webkit-text-stroke: 1px rgba(255, 247, 244, .14);
  margin-top: 80px; text-align: center;
}
.footer__bottom { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding-block: 28px 32px; font-size: 13px; border-top: 1px solid rgba(255, 247, 244, .08); }

@media (max-width: 860px) {
  .footer__grid { grid-template-columns: 1fr 1fr; }
  .footer__brand { grid-column: 1 / -1; }
}
@media (max-width: 480px) {
  .footer__grid { grid-template-columns: 1fr; }
  .footer { padding-bottom: 80px; }
}
</style>
