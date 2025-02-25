<template>
    <div v-editable="blok" class="hero_banner relative flex justify-center items-start flex-col">

        <img class="absolute top-0 left-0 h-full w-full object-cover" v-if="blok.image.filename" :src="blok.image.filename" :alt="blok.image.alt" alt="">
        
        <div class="z-[1] pl-5 md:pl-20 mb-9">
            <h1 class="relative text-white font-cormorant font-bold uppercase mb-16"> {{ blok.title }} <span class="opacity-0 absolute left-0">Vidéaste professionnel à clermont-ferrand clermont</span> </h1>
            <p class="text-white uppercase w-[80%] md:w-[50%] m-0 font-light relative"> {{ blok.description }} <span class="opacity-0 absolute left-0">Mes services en vidéo </span> </p>
        </div>

        <div class="z-[2] pl-5 md:pl-20 flex gap-6">
            <a class="button-play gap-2 font-bold" v-if="blok.link.url" :href="blok.link.url">
                <img class="h-4 w-auto object-contain" src="/images/play.svg" alt="play button">
                Play
            </a>
            <a class="bg-white bg-opacity-30 flex items-center px-4 rounded-xl font-bold text-white anchor hover:text-black" href="#"> {{ blok.anchor }}</a>
        </div>
        
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

defineProps({ blok: Object });

onMounted(() => {
    document.querySelector('.anchor')?.addEventListener('click', (event) => {
        event.preventDefault();

        // Trouver la section actuelle (le parent de `.anchor`)
        const currentSection = event.target.closest('.hero_banner');

        if (currentSection) {
            // Trouver la prochaine section (l'élément suivant dans le DOM)
            const nextSection = currentSection.nextElementSibling;

            if (nextSection) {
                // Scroller jusqu'à la prochaine section avec un effet fluide
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});
</script>   