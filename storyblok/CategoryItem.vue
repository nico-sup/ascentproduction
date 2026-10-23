<template>
     <section v-editable="blok" class="category-item my-4" data-aos="fade-up" data-aos-mirror="true">
        <div class="h-[25rem] flex flex-col justify-center px-4 relative">
             <img v-if="blok.image?.filename" :src="sbImage(blok.image.filename, '1600x0')" :alt="blok.image.alt || blok.title || ''"
                class="absolute top-0 left-0 w-full h-full object-cover z-0" loading="lazy" decoding="async" />
             <h3 class="z-[2] text-white uppercase text-3xl">{{ blok.title }}</h3>
             <p class="z-[2] text-white text-2xl mt-0 mb-4">{{ blok.subtitle }}</p>
             <SbLink :link="blok.link" :aria-label="blok.title" />
        </div>
     </section>
</template>

<script setup>
    defineProps({ blok: Object })
</script>
