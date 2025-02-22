<template>
    <div v-editable="blok" class="hero_banner relative flex justify-center items-center flex-col">
        <video autoplay muted playsinline loop class="absolute top-0 left-0 h-full w-full z-0">
            <source src="/videos/videoheader.mov"/>
        </video>
        <div class="z-[1] mt-auto pt-20">
            <h1 class="relative text-white text-center font-cormorant font-bold md:text-[4rem] uppercase mb-16"> {{ blok.title }} <span class="opacity-0 absolute">Vidéaste professionnel à clermont-ferrand clermont</span> </h1>
            <div class="grid items-center justify-center text-center">
                <h2 class="text-white uppercase text-2xl m-0 font-light relative"> {{ blok.subtitle }} <span class="opacity-0 absolute">Mes services en vidéo </span> </h2>
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
    defineProps({ blok: Object });
</script>   