<template>
  <StoryblokComponent v-if="story" :blok="story.content" />
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()

const slugParam = route.params.slug
const slug = Array.isArray(slugParam) && slugParam.length ? slugParam.join('/') : 'home'

// Les brouillons ne sont chargés que dans l'éditeur visuel Storyblok (?_storyblok=…)
// ou sur un déploiement de prévisualisation (STORYBLOK_VERSION=draft).
const version = route.query._storyblok ? 'draft' : config.public.storyblokVersion

const story = await useAsyncStoryblok(slug, { version })

if (!story.value) {
  // Vraie erreur 404 (avant : la page renvoyait "200 OK" avec un texte d'erreur)
  throw createError({ statusCode: 404, statusMessage: 'Page introuvable', fatal: true })
}

useStorySeo(story)
</script>
