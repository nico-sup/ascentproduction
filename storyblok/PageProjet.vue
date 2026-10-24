<template>
    <section v-editable="blok" class="projects-index">
        <div class="container page-hero-head">
            <h1 v-reveal class="page-hero-title">{{ blok.headline || 'Nos réalisations' }}</h1>
            <p class="page-hero-aside lede m-0">Films d'entreprise, sport automobile, outdoor, voyages : une sélection de projets tournés en France et à l'étranger.</p>
        </div>
        <div v-if="articles.length" class="projects-grid container">
            <ArticleCard
                v-for="article in articles"
                :key="article.uuid"
                :article="article.content"
                :slug="article.full_slug"
            />
        </div>
        <p v-else class="text-center container">Nos réalisations arrivent bientôt.</p>
    </section>
</template>

<script setup>
import { useStoryblokApi } from '@storyblok/vue'

defineProps({ blok: Object })

const route = useRoute()
const config = useRuntimeConfig()
const storyblokApi = useStoryblokApi()
const version = route.query._storyblok ? 'draft' : config.public.storyblokVersion

// useAsyncData : la liste est intégrée au HTML pré-généré (visible par Google et les IA)
const { data } = await useAsyncData(`projects-list-${version}`, async () => {
    const res = await storyblokApi.get('cdn/stories', {
        version,
        starts_with: 'projects/',
        is_startpage: false,
        per_page: 100,
        sort_by: 'first_published_at:desc',
    })
    return res.data.stories || []
})

const articles = computed(() => data.value || [])
</script>
