// Directive v-lazy-video : la vidéo n'est téléchargée que lorsqu'elle approche de l'écran.
// Usage : <video v-lazy-video :data-src="url" autoplay muted loop playsinline></video>
export default defineNuxtPlugin((nuxtApp) => {
  let observer = null

  const load = (el) => {
    const src = el.dataset.src
    if (src && el.getAttribute('src') !== src) {
      el.src = src
      if (el.autoplay) el.play?.().catch(() => {})
    }
  }

  nuxtApp.vueApp.directive('lazy-video', {
    getSSRProps() {
      return {}
    },
    mounted(el) {
      if (!('IntersectionObserver' in window)) return load(el)
      observer = observer || new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            load(entry.target)
            observer.unobserve(entry.target)
          }
        }
      }, { rootMargin: '300px 0px' })
      observer.observe(el)
    },
    updated(el) {
      if (el.getAttribute('src')) load(el)
    },
    beforeUnmount(el) {
      observer?.unobserve(el)
    },
  })
})
