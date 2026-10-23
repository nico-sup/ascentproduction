// Badge Calendly chargé seulement après la première interaction (scroll, clic, toucher).
// Avant : le script Calendly était chargé immédiatement sur toutes les pages,
// ce qui ralentissait l'affichage (Core Web Vitals).
export default defineNuxtPlugin(() => {
  const cfg = useAppConfig().site?.calendly
  if (!cfg?.url) return

  let loaded = false
  const events = ['scroll', 'pointerdown', 'touchstart', 'keydown']

  const load = () => {
    if (loaded) return
    loaded = true
    events.forEach(e => window.removeEventListener(e, load))

    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = 'https://assets.calendly.com/assets/external/widget.css'
    document.head.appendChild(css)

    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    script.onload = () => {
      window.Calendly?.initBadgeWidget({
        url: cfg.url,
        text: cfg.text,
        color: cfg.color,
        textColor: cfg.textColor,
      })
    }
    document.body.appendChild(script)
  }

  events.forEach(e => window.addEventListener(e, load, { passive: true, once: true }))
})
