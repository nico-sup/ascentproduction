<template>
  <StoryblokComponent v-if="story" :blok="story.content" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStoryblokApi, useStoryblokBridge } from '@storyblok/vue'

const route = useRoute()
const config = useRuntimeConfig()

const slugParam = route.params.slug
const slug = Array.isArray(slugParam) && slugParam.length ? slugParam.join('/') : 'home'

// Éditeur visuel Storyblok : l'URL contient ?_storyblok=…
const isPreview = !!route.query._storyblok

let story

if (isPreview && import.meta.client) {
  // Le site est pré-généré avec la version publiée : en mode éditeur, on charge le
  // brouillon directement dans le navigateur, puis on écoute les modifications en direct.
  story = ref(null)
  const api = useStoryblokApi()
  for (const version of ['draft', 'published']) {
    try {
      const { data } = await api.get(`cdn/stories/${slug}`, { version, cv: Date.now() })
      story.value = data.story
      break
    } catch (e) {
      // on essaie la version suivante
    }
  }
  onMounted(() => {
    if (story.value?.id) {
      useStoryblokBridge(story.value.id, (updated) => { story.value = updated })
    }
  })
} else {
  story = await useAsyncStoryblok(slug, { version: config.public.storyblokVersion })
}

if (!story.value) {
  // Vraie erreur 404 (avant : la page renvoyait "200 OK" avec un texte d'erreur)
  throw createError({ statusCode: 404, statusMessage: 'Page introuvable', fatal: true })
}

useStorySeo(story)
</script>
