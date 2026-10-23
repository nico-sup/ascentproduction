<template>
    <section v-editable="blok" class="container-full h-screen relative flex justify-center items-center">
        <img class="absolute rounded-none top-0 left-0 h-full w-full z-0 object-cover" v-if="blok.image?.filename"
            :src="sbImage(blok.image.filename, '1920x0')" :alt="blok.image.alt || ''" loading="lazy" decoding="async">

        <iframe class="z-[1] relative border-2 border-b-white max-w-[90vw]"
            v-if="embedUrl"
            width="560"
            height="315"
            :src="embedUrl"
            :title="blok.title || 'Vidéo Ascent Production'"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
        ></iframe>
    </section>
</template>

<script setup>
const props = defineProps({ blok: Object });

// Accepte youtube.com/watch?v=, youtu.be/, /shorts/, /embed/
// youtube-nocookie : pas de cookies YouTube tant que la vidéo n'est pas lancée (RGPD)
const embedUrl = computed(() => {
    const url = props.blok.videoUrl;
    if (!url) return '';
    const match = String(url).match(/(?:v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
    const id = match ? match[1] : String(url).split('/').pop().split('?')[0];
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : '';
});
</script>
