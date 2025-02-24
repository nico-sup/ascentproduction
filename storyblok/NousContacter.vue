<template>
    <section v-editable="blok" class="image-description container relative h-[40vh] flex justify-center items-center" data-aos="fade-up">
        <img v-if="blok.image" :src="blok.image.filename" :alt="blok.image.alt"  class="absolute top-0 left-0 h-full w-full object-cover rounded-none" alt="">
        <a class="bg-white px-5 z-[2] text-2xl" href="/contact">Une demande / Un projet ?</a>
    </section>
</template>

<script setup>
defineProps({ blok: Object });
</script>
