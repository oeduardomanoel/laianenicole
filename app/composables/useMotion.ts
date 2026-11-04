import { site } from '#shared/site'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

/** Roda animações GSAP dentro de um contexto que se limpa sozinho ao desmontar o componente. */
export function useMotion(scope: Ref<HTMLElement | null | undefined>, setup: (ctx: { gsap: typeof gsap, ScrollTrigger: typeof ScrollTrigger, SplitText: typeof SplitText, reduced: boolean }) => void) {
  let ctx: gsap.Context | undefined
  onMounted(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('[data-reveal]', { opacity: 1 })
        return
      }
      setup({ gsap, ScrollTrigger, SplitText, reduced })
    }, scope.value ?? undefined)
  })
  onBeforeUnmount(() => ctx?.revert())
}

export function useWhatsapp(message?: string) {
  const config = useRuntimeConfig()
  return computed(() => {
    const number = String(config.public.whatsapp || site.whatsapp).replace(/\D/g, '')
    return `https://wa.me/${number}?text=${encodeURIComponent(message || site.whatsappMessage)}`
  })
}
