// Défilement fluide (Lenis), synchronisé avec GSAP ScrollTrigger.
// Désactivé si l'utilisateur a demandé de réduire les animations.
import Lenis from '~/vendor/lenis.mjs'

export default defineNuxtPlugin((nuxtApp) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return { provide: { lenis: null } }
  }

  const lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
    // Les fenêtres (menu, réservation, galerie) gardent leur propre défilement
    prevent: (node) => !!node.closest?.('[data-lenis-prevent], dialog'),
  })

  const { $gsap, $ScrollTrigger } = nuxtApp
  if ($gsap && $ScrollTrigger) {
    lenis.on('scroll', $ScrollTrigger.update)
    $gsap.ticker.add((time) => lenis.raf(time * 1000))
    $gsap.ticker.lagSmoothing(0)
  } else {
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
  }

  // Après un changement de page : recalcul des hauteurs
  nuxtApp.hook('page:finish', () => {
    lenis.resize()
    $ScrollTrigger?.refresh()
  })

  return { provide: { lenis } }
})
