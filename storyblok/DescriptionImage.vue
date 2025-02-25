<template>
    <section v-editable="blok" class="image-description container layout-grid" data-aos="fade-up">
        <div class="col-span-full md:col-span-6 overflow-hidden" >
            <h2 data-aos="fade-left" data-aos-duration="1000" data-aos-delay="400" v-if="blok.title">{{ blok.title }}</h2>
            <p data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" v-if="blok.description">{{ blok.description }}</p>
        </div>
        <img v-if="blok.image" :src="blok.image.filename" :alt="blok.image.alt"  class="col-span-full md:col-span-5 md:col-start-8 object-cover max-h-[50vh] w-full" alt="">
    </section>
</template>

<script setup>
    defineProps({ blok: Object })
</script>