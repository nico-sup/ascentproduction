// Prépare le son du studio immersif : au clic sur un lien vers /studio, la sortie audio est
// débloquée pendant le geste, pour que la musique démarre toute seule à l'arrivée (PC et mobile).
export default defineNuxtPlugin(() => {
  let mod = null
  const load = () => import('~/lib/studio/ambience.js').then((m) => { mod = m }).catch(() => {})
  if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 3000 })
  else setTimeout(load, 1500)

  const prime = (e) => {
    const link = e.target?.closest?.('a[href]')
    if (!link || !mod) return
    const href = link.getAttribute('href') || ''
    if (!/^\/studio(\?|#|$)/.test(href)) return
    let pref = 'on'
    try { pref = localStorage.getItem('studio-sound') || 'on' } catch (err) { /* stockage indisponible */ }
    if (pref === 'off') return
    mod.getAmbience()?.prime()
  }
  // touchend / click : ce sont les gestes que Safari iOS accepte pour autoriser le son
  document.addEventListener('touchend', prime, { capture: true, passive: true })
  document.addEventListener('click', prime, true)
})
