<template>
    <section v-editable="blok" class="!mt-24">
        <h1 class="text-center px-5 mb-14 text-3xl">{{ blok.headline || 'Nos réalisations' }}</h1>
        <div v-if="articles.length" class="grid md:grid-cols-2 gap-2 container">
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
