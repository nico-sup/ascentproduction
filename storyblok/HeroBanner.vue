<template>
    <div v-editable="blok" class="hero_banner relative flex justify-center items-center flex-col">

        <video 
          :src="blok.asset.filename" 
          ref="video"
          class="absolute top-0 left-0 h-full w-full z-0" 
          autoplay 
          loop 
          muted 
          playsinline
        ></video>
        
        <!-- Bouton pour activer/désactiver le son -->
        <button @click="toggleSound" class="absolute bottom-4 right-8 z-[2] bg-black bg-opacity-50 text-white p-2 text-xl rounded-full">
            {{ isMuted ? '🔇' : '🔊' }}
        </button>

        <div class="z-[1] mt-auto pt-20">
            <h1 class="relative text-white text-center font-cormorant font-bold md:text-[4rem] uppercase mb-16">
                {{ blok.title }} 
                <span class="opacity-0 absolute left-0">Vidéaste professionnel à clermont-ferrand clermont</span>
            </h1>
            <div class="grid items-center justify-center text-center">
                <h2 class="text-white uppercase text-2xl m-0 font-light relative">
                    {{ blok.subtitle }} 
                    <span class="opacity-0 absolute left-0">Mes services en vidéo </span>
                </h2>
            </div>
        </div>

        <div class="z-[1] mt-auto flex flex-col justify-center items-center mb-10">
            <p class="text-white uppercase">scroll</p>
            <span class="line-animate">
                <span></span>
            </span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

defineProps({ blok: Object });

const video = ref(null);
const isMuted = ref(true);

const toggleSound = () => {
    if (video.value) {
        isMuted.value = !isMuted.value;
        video.value.muted = isMuted.value;
    }
};

// Fonction pour observer la vidéo dans le viewport
const handleVisibilityChange = (entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
        // La vidéo est visible, réactive le son
        video.value.muted = isMuted.value;
    } else {
        // La vidéo est hors du viewport, coupe le son
        video.value.muted = true;
    }
};

onMounted(() => {
    // Crée l'observateur d'intersection
    const observer = new IntersectionObserver(handleVisibilityChange, {
        threshold: 0.1 // Déclenchement lorsque 50% de la vidéo est visible
    });

    if (video.value) {
        observer.observe(video.value);
    }
});

onBeforeUnmount(() => {
    // Déconnecte l'observateur lors de la destruction du composant
    if (video.value) {
        observer.unobserve(video.value);
    }
});
</script>
