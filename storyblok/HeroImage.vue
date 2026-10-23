<template>
    <div ref="root" v-editable="blok" class="hero_banner hero_banner_img relative flex justify-center items-start flex-col">

        <img v-if="blok.image?.filename" class="absolute top-0 left-0 h-full w-full object-cover"
            :src="sbImage(blok.image.filename, '1920x0')" :alt="blok.image.alt || blok.title || ''"
            fetchpriority="high" decoding="async">

        <div class="z-[2] pl-5 md:pl-20 mb-9">
            <h1 class="relative text-white font-cormorant font-bold uppercase mb-16 text-[2rem]">{{ blok.title }}</h1>
            <p class="text-white uppercase w-[80%] md:w-[50%] m-0 font-light relative">{{ blok.description }}</p>
        </div>

        <div class="z-[2] pl-5 md:pl-20 flex gap-6">
            <a v-if="link.to" class="button-play gap-2 font-bold" :href="link.to"
                v-bind="link.external ? { target: '_blank', rel: 'noopener' } : {}">
                <img class="h-4 w-auto object-contain" src="/images/play.svg" alt="" width="16" height="16">
                Play
            </a>
            <a v-if="blok.anchor" class="bg-white bg-opacity-30 flex items-center px-4 rounded-xl font-bold text-white anchor hover:text-black"
                href="#contenu" @click.prevent="scrollToNext">{{ blok.anchor }}</a>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({ blok: Object });
const root = ref(null);
const link = computed(() => resolveSbLink(props.blok.link));

// Fait défiler jusqu'à la section suivante
function scrollToNext() {
    root.value?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' });
}
</script>
