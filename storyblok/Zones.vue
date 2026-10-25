<template>
    <section v-editable="blok" class="zones container">
        <div class="section-head">
            <p class="eyebrow">{{ blok.eyebrow || 'Zone d’intervention' }}</p>
            <h2 v-reveal="blok.title">{{ blok.title }}</h2>
        </div>
        <p v-if="blok.intro" class="zones-intro lede">{{ blok.intro }}</p>
        <ul class="zones-list">
            <li v-for="town in towns" :key="town">{{ town }}</li>
        </ul>
    </section>
</template>

<script setup>
import { computed } from 'vue'

// Bloc « zone d'intervention » : liste de villes + données structurées Service
// (indique à Google et aux moteurs IA quel service est proposé, et où).
const props = defineProps({ blok: { type: Object, required: true } })
const site = useAppConfig().site
const route = useRoute()

const towns = computed(() => String(props.blok.towns || '').split(/\n|,/).map((t) => t.trim()).filter(Boolean))

useHead(() => ({
    script: [{
        key: `ld-service-${props.blok._uid}`,
        type: 'application/ld+json',
        innerHTML: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: props.blok.service_name || props.blok.title,
            serviceType: props.blok.service_name || 'Production audiovisuelle',
            description: props.blok.intro || undefined,
            url: `${site.url}${route.path === '/' ? '/' : route.path}`,
            provider: { '@id': `${site.url}/#organization` },
            areaServed: towns.value.map((name) => ({ '@type': 'City', name })),
        }),
    }],
}))
</script>
