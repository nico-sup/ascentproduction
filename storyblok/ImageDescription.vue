<template>
    <section v-editable="blok" class="image-description container layout-grid" data-aos="fade-up">
        <img v-if="blok.image?.filename" :src="sbImage(blok.image.filename, '1200x0')" :alt="blok.image.alt || blok.title || ''"
            class="col-span-full md:col-span-5 object-cover max-h-[50vh] w-full" loading="lazy" decoding="async">
        <div class="md:col-start-7 col-span-full md:col-span-6 overflow-hidden">
            <h2 data-aos="fade-right" data-aos-duration="1000" data-aos-delay="400" v-if="blok.title">{{ blok.title }}</h2>
            <p data-aos="fade-up" data-aos-duration="1500" data-aos-delay="800" v-if="blok.description">{{ blok.description }}</p>
        </div>
    </section>
</template>

<script setup>

defineProps({ blok: Object });

</script>
