<template>
     <div v-editable="blok" data-aos="fade-up" data-aos-mirror="true" class="col-span-full text-center">
        <img v-if="blok.image" :src="blok.image.filename" :alt="blok.image.alt" class="hidden"/>
        <h2 class="z-[2] uppercase text-xl md:text-[4rem] md:leading-[4rem]">{{ blok.title }}</h2>
    </div>
</template>

<script setup>
    defineProps({ blok: Object })
</script>