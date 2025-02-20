<template>
    <section v-if="articles && articles.length">
        <h2 class="text-center px-5 my-14">{{ blok.headline }}</h2>
        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-9 container">
            <ArticleCard 
                v-for="article in articles"
                :key="article.uuid"
                :article="article.content"
                :slug="article.full_slug"
            />
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { useStoryblokApi } from '@storyblok/vue'
import { useRoute, useRouter } from 'vue-router'

defineProps({ blok: Object })

const articles = ref(null)
const storyblokApi = useStoryblokApi()
const route = useRoute()
const router = useRouter()

const { data } = await storyblokApi.get('cdn/stories', {
    version: route.query._storyblok ? 'draft' : 'published',
    starts_with: 'projects',
    is_startpage: false,
})

articles.value = data.stories

if (!articles.value || articles.value.length === 0) {
    router.replace('/404') // Redirige vers la page 404
}
</script>
