import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger, SplitText)
  document.documentElement.classList.add('js')

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let lenis: Lenis | null = null

  if (!reduced) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95, touchMultiplier: 1.2 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(time => lenis!.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  // Links âncora com rolagem suave
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a[href*="#"]') as HTMLAnchorElement | null
    if (!a) return
    const url = new URL(a.href, location.href)
    if (url.pathname !== location.pathname || !url.hash) return
    const target = document.querySelector(decodeURIComponent(url.hash))
    if (!target) return
    e.preventDefault()
    history.replaceState(null, '', url.hash)
    if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -70, duration: 1.4 })
    else (target as HTMLElement).scrollIntoView()
  })

  nuxtApp.hook('page:finish', () => {
    if (location.hash) {
      const t = document.querySelector(location.hash)
      if (t) {
        setTimeout(() => (lenis ? lenis.scrollTo(t as HTMLElement, { offset: -70, immediate: true }) : t.scrollIntoView()), 60)
        return
      }
    }
    lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0)
    setTimeout(() => ScrollTrigger.refresh(), 120)
  })

  // Hover magnético em botões
  nuxtApp.vueApp.directive('magnetic', {
    mounted(el: HTMLElement, binding) {
      if (reduced || !matchMedia('(hover: hover)').matches) return
      const strength = Number(binding.value ?? 0.35)
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * strength)
        yTo((e.clientY - (r.top + r.height / 2)) * strength)
      }
      const leave = () => { xTo(0); yTo(0) }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      ;(el as any).__mag = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
    },
    unmounted(el: HTMLElement) { (el as any).__mag?.() },
  })

  // Tilt 3D em cards
  nuxtApp.vueApp.directive('tilt', {
    mounted(el: HTMLElement, binding) {
      if (reduced || !matchMedia('(hover: hover)').matches) return
      const max = Number(binding.value ?? 8)
      gsap.set(el, { transformPerspective: 900, transformStyle: 'preserve-3d' })
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power3' })
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power3' })
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        ry((px - 0.5) * max * 2)
        rx(-(py - 0.5) * max * 2)
        el.style.setProperty('--mx', `${px * 100}%`)
        el.style.setProperty('--my', `${py * 100}%`)
      }
      const leave = () => { rx(0); ry(0) }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      ;(el as any).__tilt = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
    },
    unmounted(el: HTMLElement) { (el as any).__tilt?.() },
  })

  return { provide: { lenis, gsap, ScrollTrigger, reducedMotion: reduced } }
})
