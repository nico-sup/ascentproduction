<template>
  <StoryblokComponent v-if="story" :blok="story.content" />
</template>

<script setup>
import { onMounted } from 'vue'
import { useStoryblokApi, useStoryblokBridge } from '@storyblok/vue'

const route = useRoute()
const config = useRuntimeConfig()
const api = useStoryblokApi()

const slugParam = route.params.slug
const slug = Array.isArray(slugParam) && slugParam.length ? slugParam.join('/') : 'home'

// Éditeur visuel Storyblok : l'URL contient ?_storyblok=…
const isPreview = !!route.query._storyblok

const fetchStory = async (version) => {
  try {
    const { data } = await api.get(`cdn/stories/${slug}`, version === 'draft' ? { version, cv: Date.now() } : { version })
    return data.story
  } catch (e) {
    return null
  }
}

// Version publiée : intégrée au HTML pré-généré (Google, IA, visiteurs)
const { data: story } = await useAsyncData(`story-${slug}`, () => fetchStory(config.public.storyblokVersion))

if (isPreview && import.meta.client) {
  // Page jamais publiée : pas de HTML pré-généré, on charge directement le brouillon
  if (!story.value) story.value = await fetchStory('draft')

  // On remplace le contenu publié par le brouillon APRÈS l'affichage initial.
  // (Le faire pendant l'hydratation laissait les anciennes images à l'écran.)
  onMounted(async () => {
    const draft = await fetchStory('draft')
    if (draft) story.value = draft
    if (story.value?.id) {
      useStoryblokBridge(story.value.id, (updated) => { story.value = updated })
    }
  })
}

// En mode éditeur côté serveur, une page jamais publiée n'est pas une erreur : le brouillon est chargé dans le navigateur
if (!story.value && !(isPreview && import.meta.server)) {
  throw createError({ statusCode: 404, statusMessage: 'Page introuvable', fatal: true })
}

if (story.value) useStorySeo(story)
</script>
