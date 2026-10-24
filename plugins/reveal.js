// Directive v-reveal : le titre apparaît mot par mot quand il entre à l'écran.
// Le texte reste intact dans le HTML (référencement) ; le découpage se fait dans le navigateur.
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

export default defineNuxtPlugin((nuxtApp) => {
  let observer = null
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const getObserver = () => {
    if (observer) return observer
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      }
    }, { rootMargin: '0px 0px -8% 0px' })
    return observer
  }

  const split = (el) => {
    const text = (el.textContent || '').trim()
    if (!text || el.dataset.revealText === text) return
    el.dataset.revealText = text
    el.setAttribute('aria-label', text)
    el.innerHTML = text
      .split(/\s+/)
      .map((word, i) => `<span class="rv-w" aria-hidden="true"><span class="rv-i" style="--i:${i}">${escapeHtml(word)}</span></span>`)
      .join(' ')
    el.classList.add('is-split')
  }

  nuxtApp.vueApp.directive('reveal', {
    getSSRProps() {
      return { 'data-reveal': '' }
    },
    mounted(el) {
      if (reduced() || !('IntersectionObserver' in window)) {
        el.classList.add('is-split', 'is-revealed')
        return
      }
      split(el)
      getObserver().observe(el)
    },
    updated(el) {
      // Contenu modifié (ex. éditeur visuel Storyblok) : on redécoupe
      if (el.classList.contains('is-revealed') && el.textContent.trim() !== el.dataset.revealText) {
        delete el.dataset.revealText
        split(el)
        el.classList.add('is-revealed')
      }
    },
    beforeUnmount(el) {
      observer?.unobserve(el)
    },
  })
})
