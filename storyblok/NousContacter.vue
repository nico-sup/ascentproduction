<template>
    <section v-editable="blok" class="image-description container relative h-[40vh] flex justify-center items-center" data-aos="fade-up">
        <img v-if="blok.image?.filename" :src="sbImage(blok.image.filename, '1600x0')" :alt="blok.image.alt || ''"
            class="absolute top-0 left-0 h-full w-full object-cover rounded-none" loading="lazy" decoding="async">
        <NuxtLink class="bg-white px-5 z-[2] text-2xl" to="/contact">Une demande / Un projet ?</NuxtLink>
    </section>
</template>

<script setup>
defineProps({ blok: Object });
</script>
