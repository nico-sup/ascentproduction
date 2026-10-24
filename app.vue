<template>
    <NuxtLayout>
        <a href="#contenu" class="skip-link">Aller au contenu</a>
        <Header />
        <main id="contenu">
            <NuxtPage />
        </main>
        <Footer />
        <ClientOnly>
            <AppCursor />
        </ClientOnly>
    </NuxtLayout>
</template>

<script setup>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

const site = useAppConfig().site
const sameAs = Object.values(site.socials || {}).filter(Boolean)

// Fiche entreprise lue par Google (fiche locale) et par les moteurs IA
const organization = {
    '@type': ['ProfessionalService', 'Organization'],
    '@id': `${site.url}/#organization`,
    name: site.name,
    alternateName: site.alternateName,
    slogan: 'Rise. Capture. Inspire.',
    description: site.description,
    url: `${site.url}/`,
    logo: { '@type': 'ImageObject', url: `${site.url}${site.logo}`, width: 1200, height: 238 },
    image: `${site.url}${site.ogImage}`,
    telephone: site.phoneIntl,
    email: site.email,
    address: {
        '@type': 'PostalAddress',
        addressLocality: site.city,
        postalCode: site.postalCode,
        addressRegion: site.region,
        addressCountry: site.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.latitude, longitude: site.geo.longitude },
    areaServed: [
        { '@type': 'City', name: 'Clermont-Ferrand' },
        { '@type': 'AdministrativeArea', name: site.department },
        { '@type': 'AdministrativeArea', name: 'Auvergne' },
        { '@type': 'AdministrativeArea', name: site.region },
        { '@type': 'Country', name: 'France' },
    ],
    knowsAbout: [
        'Production audiovisuelle', 'Vidéo d\'entreprise', 'Vidéo publicitaire', 'Captation événementielle',
        'Drone', 'Drone FPV', 'Prise de vue aérienne', 'Photographie professionnelle',
        'Montage vidéo', 'Post-production', 'Podcast', 'Création de sites internet',
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: site.phoneIntl,
        email: site.email,
        contactType: 'customer service',
        areaServed: 'FR',
        availableLanguage: ['French'],
    },
    hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services de production audiovisuelle',
        itemListElement: site.services.map(s => ({
            '@type': 'Offer',
            itemOffered: {
                '@type': 'Service',
                name: s.name,
                description: s.description,
                provider: { '@id': `${site.url}/#organization` },
                areaServed: { '@type': 'Country', name: 'France' },
            },
        })),
    },
    ...(sameAs.length ? { sameAs } : {}),
}

const website = {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: `${site.url}/`,
    name: site.name,
    inLanguage: 'fr-FR',
    publisher: { '@id': `${site.url}/#organization` },
}

useHead({
    titleTemplate: (title) => {
        if (!title) return site.defaultTitle
        return title.includes(site.name) ? title : `${title} | ${site.name}`
    },
    script: [
        {
            key: 'ld-organization',
            type: 'application/ld+json',
            innerHTML: jsonLd({ '@context': 'https://schema.org', '@graph': [organization, website] }),
        },
    ],
})

useSeoMeta({
    description: site.description,
})
</script>
