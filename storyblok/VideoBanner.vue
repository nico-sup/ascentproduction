<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useNuxtApp } from '#app';

defineProps({ blok: Object });

const { $gsap } = useNuxtApp();
const videoContainer = ref(null);
const videoElement = ref(null);
const observer = ref(null); // Intersection Observer
let tween = null;

// Fonction pour charger la vidéo une fois dans le viewport
const loadVideo = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      videoElement.value?.play().catch(() => {}); // Lancer la vidéo si elle est dans le viewport
      observer.value.disconnect(); // Arrêter l'observation une fois la vidéo lancée
    }
  });
};

onMounted(() => {
  // Observer pour vérifier si la vidéo entre dans le viewport
  observer.value = new IntersectionObserver(loadVideo, { threshold: 0.5 });

  if (videoContainer.value) {
    observer.value.observe(videoContainer.value);
  }

  if (!videoElement.value) return;
  tween = $gsap.fromTo(videoElement.value,
    { scale: 0.5, y: "20vh" },
    {
      scale: 0.9, y: "0vh",
      ease: "power2.out",
      scrollTrigger: {
        trigger: videoContainer.value,
        start: "10% bottom",  // Début de l'effet avant que la vidéo soit visible
        end: "80% center",   // Fin de l'effet quand la vidéo est bien dans le viewport
        scrub: true,
      },
    }
  );
});

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect(); // Nettoyer l'observateur lors du démontage
  }
  // Supprime l'animation et son ScrollTrigger (évite les fuites entre les pages)
  tween?.scrollTrigger?.kill();
  tween?.kill();
});
</script>

<template>
  <section ref="videoContainer" v-editable="blok" class="h-[70vh] md:h-[100vh] container flex items-center relative justify-center">
    <div class="absolute container top-0 left-0 w-full h-[70vh] md:h-screen flex justify-center items-center overflow-hidden">
      <video v-if="blok.video?.filename" ref="videoElement" muted loop playsinline preload="metadata" aria-hidden="true" class="h-full w-full object-cover">
        <source :src="blok.video.filename" />
      </video>
    </div>
  </section>
</template>
