<template>
    <div v-editable="blok" class="hero_banner relative flex justify-center items-center flex-col">
        <video autoplay muted loop class="absolute top-0 left-0 h-full w-full z-0">
            <source src="/videos/videoheader.mov"/>
        </video>
        <div class="z-[1] mt-auto pt-20">
            <h1 class=" text-white text-center font-cormorant font-bold md:text-[4rem] uppercase mb-16"> {{ blok.title }}</h1>
            <div class="grid items-center justify-center text-center">
                <h5 class="text-white uppercase text-2xl m-0 font-light"> {{ blok.subtitle }}</h5>
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