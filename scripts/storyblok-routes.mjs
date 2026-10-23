// Récupère la liste des pages publiées dans Storyblok au moment du build.
// Sert à la fois au pré-rendu (nuxt generate) et au sitemap.xml.

let cache = null

// Slugs Storyblok qui ne sont pas des pages du site
const EXCLUDED = [/^global(\/|$)/, /^config(\/|$)/, /^settings(\/|$)/, /^404$/]

export async function fetchStoryblokRoutes({ token } = {}) {
  if (cache) return cache
  if (!token) {
    console.warn('[storyblok-routes] STORYBLOK_TOKEN absent : seules les pages liées depuis le site seront pré-générées.')
    return []
  }

  const routes = []
  const perPage = 100
  let page = 1
  let total = Infinity

  try {
    while ((page - 1) * perPage < total) {
      const url = `https://api.storyblok.com/v2/cdn/stories?token=${encodeURIComponent(token)}&version=published&per_page=${perPage}&page=${page}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      total = Number(res.headers.get('total') || 0)
      const { stories = [] } = await res.json()
      for (const story of stories) {
        const slug = String(story.full_slug || '').replace(/\/$/, '')
        if (!slug || EXCLUDED.some(re => re.test(slug))) continue
        routes.push({
          path: slug === 'home' ? '/' : `/${slug}`,
          lastmod: story.published_at || story.updated_at || undefined,
        })
      }
      if (!stories.length) break
      page++
    }
  } catch (e) {
    console.warn(`[storyblok-routes] Impossible de lister les pages Storyblok (${e.message}).`)
  }

  cache = routes
  return routes
}
