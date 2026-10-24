<template>
    <section ref="root" v-editable="blok" class="page-hero">
        <div class="container page-hero-head">
            <h1 v-reveal="blok.title" class="page-hero-title">{{ blok.title }}</h1>
            <div class="page-hero-aside">
                <p v-if="blok.description" class="lede m-0">{{ blok.description }}</p>
                <div v-if="link.to || blok.anchor" class="flex flex-wrap gap-3 mt-6">
                    <a v-if="link.to" class="button" :href="link.to"
                        v-bind="link.external ? { target: '_blank', rel: 'noopener' } : {}">
                        <img class="h-3 w-auto invert" src="/images/play.svg" alt="" width="12" height="12">
                        Voir la vidéo
                    </a>
                    <a v-if="blok.anchor" class="button-ghost" href="#contenu" @click.prevent="scrollToNext">{{ blok.anchor }}</a>
                </div>
            </div>
        </div>

        <div v-if="blok.image?.filename" class="page-hero-frame">
            <img :src="sbImage(blok.image.filename, '1920x0')" :alt="blok.image.alt || blok.title || ''"
                fetchpriority="high" decoding="async">
            <div class="viewfinder" aria-hidden="true"><span></span></div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({ blok: Object });
const root = ref(null);
const link = computed(() => resolveSbLink(props.blok.link));
const nuxtApp = useNuxtApp();

// Fait défiler jusqu'à la section suivante
function scrollToNext() {
    const next = root.value?.nextElementSibling;
    if (!next) return;
    if (nuxtApp.$lenis) nuxtApp.$lenis.scrollTo(next, { offset: -80 });
    else next.scrollIntoView({ behavior: 'smooth' });
}
</script>
