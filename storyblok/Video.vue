<template>
    <section v-editable="blok" class="container-full h-screen relative flex justify-center items-center">
        <img class="absolute rounded-none top-0 left-0 h-full w-full z-0 object-cover" v-if="blok.image" :src="blok.image.filename" :alt="blok.image.alt" alt="">
        
        <iframe class="z-[1] relative border-2 border-b-white" 
            v-if="blok.videoUrl" 
            width="560" 
            height="315" 
            :src="getYoutubeEmbedUrl(blok.videoUrl)" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen
        ></iframe>
    </section>
</template>

<script setup>
defineProps({ blok: Object });

// Fonction pour transformer une URL YouTube en URL d'intégration
const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    
    // Extrait l'ID de la vidéo YouTube
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    
    return `https://www.youtube.com/embed/${videoId}`;
};
</script>
