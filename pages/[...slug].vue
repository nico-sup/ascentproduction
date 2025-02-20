<template>
  <StoryblokComponent v-if="story" :blok="story.content" />
  <div v-else>
    <!-- Ici, on peut afficher un message ou rediriger vers la page 404 si la story est introuvable -->
    <p>Cette page est introuvable.</p>
  </div>
</template>

<script setup>
import { useRoute, useError } from 'nuxt/app' // On importe la fonction useError pour gérer l'erreur

const { slug } = useRoute().params
const error = useError() // Cette fonction permet de déclencher une erreur

let story = null

// Vérification si le slug est valide et récupération de la story
try {
  story = await useAsyncStoryblok(
    slug && slug.length > 0 ? slug.join('/') : 'home',
    { version: 'draft' }
  )

  // Si la story n'existe pas, on force l'affichage de la page 404
  if (!story) {
    error({ statusCode: 404, message: "Page non trouvée" })
  }
} catch (e) {
  // En cas d'erreur (ex: pas de story pour ce slug), on redirige vers 404
  error({ statusCode: 404, message: "Page non trouvée" })
}
</script>
