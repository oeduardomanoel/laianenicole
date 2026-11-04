<script setup lang="ts">
const props = defineProps<{ items: { q: string, a: string }[], title?: string, id?: string }>()
const el = ref<HTMLElement | null>(null)
const open = ref<number | null>(0)

useMotion(el, ({ gsap }) => {
  gsap.to(el.value!.querySelectorAll('[data-reveal]'), {
    opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06, startAt: { y: 30 },
    scrollTrigger: { trigger: el.value, start: 'top 78%', once: true },
  })
})
void props
</script>

<template>
  <section :id="id ?? 'duvidas'" ref="el" class="section faq" aria-labelledby="faq-title">
    <div class="container faq__grid">
      <div class="faq__intro">
        <p class="eyebrow" data-reveal>Dúvidas</p>
        <h2 id="faq-title" class="display-md" data-reveal>{{ title ?? 'Perguntas que chegam no direct' }}</h2>
      </div>
      <div class="faq__list">
        <div v-for="(f, i) in items" :key="f.q" class="qa" :class="{ 'is-open': open === i }" data-reveal>
          <h3>
            <button class="qa__q" :aria-expanded="open === i" :aria-controls="`qa-${i}`" @click="open = open === i ? null : i">
              <span>{{ f.q }}</span>
              <span class="qa__icon" aria-hidden="true"><AppIcon name="plus" /></span>
            </button>
          </h3>
          <div :id="`qa-${i}`" class="qa__a" role="region">
            <div><p>{{ f.a }}</p></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq { background: var(--cream-50); color: var(--wine-900); }
.faq__grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: clamp(40px, 6vw, 100px); }
.faq__intro { display: grid; gap: 20px; align-content: start; }
.faq__intro .eyebrow { color: var(--wine-600); }
.qa { border-top: 1px solid rgba(122, 11, 53, .15); }
.qa:last-child { border-bottom: 1px solid rgba(122, 11, 53, .15); }
.qa h3 { font-family: var(--font-body); }
.qa__q {
  width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 20px; text-align: left;
  padding: 26px 0; font-family: var(--font-display); font-size: clamp(21px, 1.9vw, 27px); line-height: 1.25; letter-spacing: -0.01em;
  transition: color .3s;
}
.qa__q:hover { color: var(--wine-600); }
.qa__icon {
  flex: none; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center;
  box-shadow: inset 0 0 0 1px rgba(122, 11, 53, .25);
  transition: transform .6s var(--ease-out), background .4s, color .4s;
}
.qa__q:hover .qa__icon { background: var(--wine-700); color: var(--cream-50); }
.is-open .qa__icon { transform: rotate(135deg); background: var(--gold-400); color: var(--wine-900); box-shadow: none; }
.qa__a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .6s var(--ease-out); }
.qa__a > div { overflow: hidden; }
.qa__a p { padding: 0 64px 28px 0; color: var(--wine-800); opacity: .85; font-size: 17px; }
.is-open .qa__a { grid-template-rows: 1fr; }
@media (max-width: 860px) {
  .faq__grid { grid-template-columns: 1fr; }
  .qa__a p { padding-right: 0; }
}
</style>
