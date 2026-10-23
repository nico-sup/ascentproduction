<template>
    <NuxtLink v-if="resolved.to && !resolved.external" :to="resolved.to" v-bind="$attrs"><slot /></NuxtLink>
    <a v-else-if="resolved.to" :href="resolved.to" target="_blank" rel="noopener" v-bind="$attrs"><slot /></a>
</template>

<script setup>
// Lien Storyblok : interne -> NuxtLink (navigation rapide, lien suivi par Google), externe -> nouvel onglet
defineOptions({ inheritAttrs: false })
const props = defineProps({ link: Object })
const resolved = computed(() => resolveSbLink(props.link))
</script>
