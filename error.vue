<template>
    <Header />
    <main id="contenu" class="container min-h-[70vh] flex flex-col justify-center items-center text-center pt-32 pb-20">
        <p class="text-green-light-ascent text-xl">Erreur {{ error?.statusCode || 500 }}</p>
        <h1>{{ is404 ? 'Cette page est introuvable' : 'Une erreur est survenue' }}</h1>
        <p class="max-w-xl">
            {{ is404
                ? "La page que vous cherchez n'existe pas ou a été déplacée."
                : 'Merci de réessayer dans quelques instants.' }}
        </p>
        <div class="flex flex-wrap gap-4 justify-center mt-6">
            <button class="button" @click="handleError">Retour à l'accueil</button>
            <NuxtLink class="button" to="/contact">Nous contacter</NuxtLink>
        </div>
    </main>
    <Footer />
</template>

<script setup>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

const props = defineProps({ error: Object })
const is404 = computed(() => props.error?.statusCode === 404)

useHead({
    title: () => (is404.value ? 'Page introuvable' : 'Erreur'),
    htmlAttrs: { lang: 'fr' },
    meta: [{ name: 'robots', content: 'noindex, follow' }],
})

const handleError = () => clearError({ redirect: '/' })
</script>
