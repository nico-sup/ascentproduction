<template>
    <section v-editable="blok" class="container pricing" :class="{ 'is-page-top': blok.as_h1 }">
        <div class="max-w-3xl mb-12">
            <span v-if="blok.tag" class="block mb-2" data-aos="fade-right">{{ blok.tag }}</span>
            <component :is="blok.as_h1 ? 'h1' : 'h2'" class="text-green-light-ascent text-3xl md:text-5xl">{{ blok.title }}</component>
            <p v-if="blok.intro" class="text-lg">{{ blok.intro }}</p>
        </div>

        <ul class="pricing-grid">
            <li v-for="pack in packs" :key="pack._uid" v-editable="pack" class="pricing-card" :class="{ 'is-highlighted': pack.highlighted }"
                data-aos="fade-up">
                <span v-if="pack.badge" class="pricing-badge">{{ pack.badge }}</span>

                <h3 class="pricing-name">{{ pack.name }}</h3>
                <p v-if="pack.tagline" class="pricing-tagline">{{ pack.tagline }}</p>

                <p class="pricing-price">
                    <span v-if="pack.price_prefix" class="pricing-prefix">{{ pack.price_prefix }}</span>
                    <span class="pricing-amount">{{ pack.price }}</span>
                    <span v-if="pack.price_suffix" class="pricing-suffix">{{ pack.price_suffix }}</span>
                </p>

                <!-- Réservation directe : ouvre le formulaire avec le pack et le prix pré-remplis -->
                <button type="button" class="button w-full justify-center mb-6" @click="booking?.open(pack)"
                    :aria-label="`${pack.cta_label || 'Réserver cette offre'} : ${pack.name}`">
                    {{ pack.cta_label || 'Réserver cette offre' }}
                </button>

                <ul class="pricing-features">
                    <li v-for="(feature, i) in pack.featureList" :key="i">
                        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" class="shrink-0 mt-1">
                            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>{{ feature }}</span>
                    </li>
                </ul>

                <p class="mt-auto pt-6 mb-0 text-sm">
                    <SbLink v-if="hasLink(pack.cta_link)" :link="pack.cta_link" class="underline">Une question ? Contactez-moi</SbLink>
                    <NuxtLink v-else to="/contact" class="underline">Une question ? Contactez-moi</NuxtLink>
                </p>
            </li>
        </ul>

        <p v-if="blok.note" class="pricing-note">{{ blok.note }}</p>

        <ClientOnly>
            <BookingDialog ref="booking" />
        </ClientOnly>
    </section>
</template>

<script setup>
// Bloc Storyblok "pricing" (grille de packs tarifaires)
//   tag, title, as_h1 (booléen), intro, note, packs (blocs "pricing_pack")
// Bloc "pricing_pack" :
//   name, tagline, badge, highlighted (booléen), price_prefix, price, price_suffix,
//   features (Textarea : une prestation par ligne), cta_label (texte du bouton de réservation),
//   cta_link (lien facultatif pour « Une question ? »)
// Génère aussi les données structurées des offres (prix lisibles par Google et les IA).
const props = defineProps({ blok: Object })
const site = useAppConfig().site
const route = useRoute()

const hasLink = link => !!resolveSbLink(link).to
const booking = ref(null)

const packs = computed(() =>
    (props.blok.packs || []).map(p => ({
        ...p,
        featureList: String(p.features || '')
            .split('\n')
            .map(l => l.replace(/^[-•*]\s*/, '').trim())
            .filter(Boolean),
    }))
)

// "1 450" / "1450 €" -> 1450
const toNumber = v => {
    const n = Number(String(v || '').replace(/[^\d,.]/g, '').replace(',', '.'))
    return Number.isFinite(n) && n > 0 ? n : null
}

useHead({
    script: [{
        key: `ld-pricing-${props.blok._uid}`,
        type: 'application/ld+json',
        innerHTML: () => {
            const offers = packs.value
                .map(p => ({ p, price: toNumber(p.price) }))
                .filter(({ price }) => price)
                .map(({ p, price }) => ({
                    '@type': 'Offer',
                    name: p.name,
                    description: [p.tagline, ...p.featureList].filter(Boolean).join(' · '),
                    priceCurrency: 'EUR',
                    price,
                    priceSpecification: {
                        '@type': 'UnitPriceSpecification',
                        priceCurrency: 'EUR',
                        ...( /partir/i.test(p.price_prefix || '') ? { minPrice: price } : { price }),
                        valueAddedTaxIncluded: !/HT/i.test(p.price_suffix || ''),
                    },
                    availability: 'https://schema.org/InStock',
                    areaServed: { '@type': 'Country', name: 'France' },
                    seller: { '@id': `${site.url}/#organization` },
                    url: `${site.url}${route.path}`,
                    itemOffered: {
                        '@type': 'Service',
                        name: p.name,
                        serviceType: 'Production vidéo',
                        provider: { '@id': `${site.url}/#organization` },
                    },
                }))
            return offers.length
                ? jsonLd({
                    '@context': 'https://schema.org',
                    '@type': 'OfferCatalog',
                    name: props.blok.title || 'Tarifs',
                    itemListElement: offers,
                })
                : ''
        },
    }],
})
</script>
