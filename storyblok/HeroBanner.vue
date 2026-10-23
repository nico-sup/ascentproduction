<template>
    <div v-editable="blok" class="hero_banner relative flex justify-center items-center flex-col">

        <video
          v-if="blok.asset?.filename"
          :src="blok.asset.filename"
          ref="video"
          class="absolute top-0 left-0 h-full w-full z-0"
          autoplay
          loop
          muted
          playsinline
          preload="metadata"
          aria-hidden="true"
        ></video>

        <!-- Bouton pour activer/désactiver le son -->
        <button type="button" @click="toggleSound"
            :aria-label="isMuted ? 'Activer le son de la vidéo' : 'Couper le son de la vidéo'"
            class="absolute bottom-4 right-8 z-[2] max-w-[80%] bg-black bg-opacity-50 text-white p-2 text-xl rounded-full">
            <span aria-hidden="true">{{ isMuted ? '🔇' : '🔊' }}</span>
        </button>

        <div class="z-[1] mt-auto pt-20">
            <h1 class="relative text-white mx-auto font-cormorant text-center font-bold max-w-[80%] text-[2rem] md:text-[2rem] uppercase mb-16">
                {{ blok.title }}
            </h1>
            <div class="grid items-center justify-center text-center">
                <p class="text-white uppercase text-xl m-0 font-light relative">
                    {{ blok.subtitle }}
                </p>
            </div>
        </div>

        <div class="z-[1] mt-auto flex flex-col justify-center items-center mb-10" aria-hidden="true">
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
let observer = null;

const toggleSound = () => {
    if (video.value) {
        isMuted.value = !isMuted.value;
        video.value.muted = isMuted.value;
    }
};

// Coupe le son quand la vidéo sort de l'écran
const handleVisibilityChange = (entries) => {
    const entry = entries[0];
    if (!video.value) return;
    video.value.muted = entry.isIntersecting ? isMuted.value : true;
};

onMounted(() => {
    if (!video.value || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(handleVisibilityChange, { threshold: 0.1 });
    observer.observe(video.value);
});

onBeforeUnmount(() => {
    // Avant : "observer" n'existait pas ici → erreur à chaque changement de page
    observer?.disconnect();
    observer = null;
});
</script>
