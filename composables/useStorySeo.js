// Balises SEO d'une page Storyblok : title, description, Open Graph, canonical et JSON-LD.
//
// Champs Storyblok reconnus (dans l'ordre de priorité) :
//  - champ "seo" du plugin SEO Storyblok (title, description, og_image…)
//  - seo_title / seo_description / og_image (champs texte/asset que tu peux ajouter à tes composants)
//  - title / description / image (déjà présents sur tes articles)
//  - nom de la story en dernier recours
export function useStorySeo(storyRef) {
  const site = useAppConfig().site

  const data = computed(() => {
    const story = unref(storyRef) || {}
    const c = story.content || {}
    const seo = c.seo && typeof c.seo === 'object' ? c.seo : {}
    const fullSlug = String(story.full_slug || '').replace(/\/$/, '')
    const isHome = !fullSlug || fullSlug === 'home'
    // Pages "page" (liste de blocs) : on reprend le titre / texte du premier bloc qui en a un
    const blocks = Array.isArray(c.body) ? c.body : []
    const firstTitled = blocks.find(b => typeof (b.title || b.headline) === 'string' && (b.title || b.headline).trim())
    const firstDescribed = blocks.find(b => typeof (b.description || b.subtitle) === 'string' && (b.description || b.subtitle).trim())
    const path = isHome ? '/' : `/${fullSlug}`
    const url = `${site.url}${path}`

    const title = (isHome
      ? seo.title || c.seo_title || site.defaultTitle
      : seo.title || c.seo_title || c.meta_title || c.title || firstTitled?.title || firstTitled?.headline || story.name || site.defaultTitle
    ).trim()

    const description =
      toMetaText(seo.description || c.seo_description || c.meta_description || c.description) ||
      (!isHome && toMetaText(firstDescribed?.description || firstDescribed?.subtitle)) ||
      toMetaText(site.description)

    const ogSrc =
      (typeof seo.og_image === 'string' && seo.og_image) ||
      c.og_image?.filename ||
      c.image?.filename ||
      c.bg_left?.filename ||
      ''
    const image = ogSrc ? sbImage(ogSrc, '1200x630', 80) : `${site.url}${site.ogImage}`

    // Fil d'Ariane : Accueil > dossier > page
    const segments = isHome ? [] : fullSlug.split('/')
    const breadcrumb = [{ name: 'Accueil', url: `${site.url}/` }]
    segments.forEach((seg, i) => {
      const last = i === segments.length - 1
      breadcrumb.push({
        name: last ? title : humanizeSlug(seg),
        url: `${site.url}/${segments.slice(0, i + 1).join('/')}`,
      })
    })

    const isProject = fullSlug.startsWith('projects/')

    const graph = [
      {
        '@type': isProject ? ['WebPage', 'ItemPage'] : 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: 'fr-FR',
        isPartOf: { '@id': `${site.url}/#website` },
        about: { '@id': `${site.url}/#organization` },
        primaryImageOfPage: { '@type': 'ImageObject', url: image },
        ...(story.published_at ? { datePublished: story.first_published_at || story.published_at, dateModified: story.published_at } : {}),
        ...(breadcrumb.length > 1 ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
      },
    ]
    if (breadcrumb.length > 1) {
      graph.push({
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: breadcrumb.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })),
      })
    }

    return { title, description, image, url, isProject, graph }
  })

  useSeoMeta({
    title: () => data.value.title,
    description: () => data.value.description,
    ogTitle: () => data.value.title,
    ogDescription: () => data.value.description,
    ogImage: () => data.value.image,
    ogUrl: () => data.value.url,
    ogType: () => (data.value.isProject ? 'article' : 'website'),
    twitterCard: 'summary_large_image',
    twitterTitle: () => data.value.title,
    twitterDescription: () => data.value.description,
    twitterImage: () => data.value.image,
  })

  useHead({
    link: [{ rel: 'canonical', href: () => data.value.url }],
    script: [
      {
        key: 'ld-page',
        type: 'application/ld+json',
        innerHTML: () => jsonLd({ '@context': 'https://schema.org', '@graph': data.value.graph }),
      },
    ],
  })
}
