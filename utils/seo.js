// Outils SEO partagés (auto-importés par Nuxt)

/**
 * Image Storyblok redimensionnée et compressée par le CDN Storyblok
 * (WebP/AVIF automatiques selon le navigateur).
 * @param {string} src   URL Storyblok (asset.filename)
 * @param {string} size  "largeurxhauteur", 0 = automatique. Ex: "1600x0"
 */
export function sbImage(src, size = '1600x0', quality = 75) {
  if (!src || typeof src !== 'string') return ''
  if (!/\/\/a(-[a-z]+)?\.storyblok\.com\//.test(src)) return src
  if (/\.(svg|gif)(\?|$)/i.test(src) || src.includes('/m/')) return src
  return `${src}/m/${size}/filters:quality(${quality})`
}

/** Sérialise un objet JSON-LD sans risque d'injection de balise </script>. */
export function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** Texte brut court pour les meta descriptions. */
export function toMetaText(value, max = 160) {
  if (!value) return ''
  let text = value
  if (typeof value === 'object') {
    // Richtext Storyblok : on récupère les textes
    const parts = []
    const walk = n => {
      if (!n) return
      if (n.text) parts.push(n.text)
      if (Array.isArray(n.content)) n.content.forEach(walk)
    }
    walk(value)
    text = parts.join(' ')
  }
  text = String(text).replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 80 ? cut.lastIndexOf(' ') : cut.length)}…`
}

/** "production-audiovisuelle" -> "Production audiovisuelle" */
export function humanizeSlug(slug) {
  const s = decodeURIComponent(String(slug || '')).replace(/[-_]+/g, ' ').trim()
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}

/** Lien Storyblok (multilink) -> { to, external } */
export function resolveSbLink(link) {
  if (!link) return { to: '', external: false }
  if (link.linktype === 'story') {
    const slug = (link.cached_url || link.story?.full_slug || '').replace(/\/$/, '')
    return { to: slug === 'home' || !slug ? '/' : `/${slug}`, external: false }
  }
  if (link.linktype === 'email' && link.email) return { to: `mailto:${link.email}`, external: true }
  const url = link.url || link.cached_url || ''
  if (!url) return { to: '', external: false }
  if (url.startsWith('/')) return { to: url, external: false }
  return { to: url, external: /^https?:\/\//.test(url) }
}

/**
 * Optimise les images d'un texte riche Storyblok (HTML) :
 * redimensionnement par le CDN Storyblok + chargement différé.
 */
export function optimizeRichTextImages(html, size = '1200x0') {
  if (!html || typeof html !== 'string') return html || ''
  return html.replace(/<img\b([^>]*?)\ssrc="([^"]+)"([^>]*?)\s*\/?>/gi, (match, before, src, after) => {
    const attrs = `${before} ${after}`
    const lazy = /\sloading=/.test(attrs) ? '' : ' loading="lazy"'
    const decoding = /\sdecoding=/.test(attrs) ? '' : ' decoding="async"'
    return `<img${before} src="${sbImage(src, size)}"${after}${lazy}${decoding}>`
  })
}
