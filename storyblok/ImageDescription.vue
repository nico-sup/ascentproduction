<template>
    <section v-editable="blok" class="image-description container layout-grid" data-aos="fade-up">
        <img v-if="blok.image" :src="blok.image.filename" :alt="blok.image.alt"  class="col-span-full md:col-span-5 object-cover max-h-[50vh] w-full" alt="">
        <div class="md:col-start-7 col-span-full md:col-span-6">
            <h2 data-aos="fade-right" data-aos-duration="1000" data-aos-delay="400" v-if="blok.title">{{ blok.title }}</h2>
            <p data-aos="fade-up" data-aos-duration="1500" data-aos-delay="800" v-if="blok.description">{{ blok.description }}</p>
        </div>
    </section>
</template>

<script setup>

defineProps({ blok: Object });

</script>
