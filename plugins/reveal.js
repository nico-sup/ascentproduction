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

  // Le texte vient de la valeur de la directive (v-reveal="blok.title") quand elle existe :
  // ainsi une modification dans l'éditeur Storyblok met bien le titre à jour.
  const split = (el, value) => {
    const text = String(value ?? el.textContent ?? '').trim()
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
    mounted(el, binding) {
      if (reduced() || !('IntersectionObserver' in window)) {
        el.classList.add('is-split', 'is-revealed')
        return
      }
      split(el, binding.value)
      getObserver().observe(el)
    },
    updated(el, binding) {
      // Contenu modifié (ex. éditeur visuel Storyblok) : on redécoupe
      if (binding.value === undefined || binding.value === binding.oldValue) return
      if (!el.classList.contains('is-split')) { el.textContent = binding.value ?? ''; return }
      split(el, binding.value)
    },
    beforeUnmount(el) {
      observer?.unobserve(el)
    },
  })
})
