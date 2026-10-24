<template>
    <section v-editable="blok" class="container split is-reversed">
        <div class="split-text">
            <h2 v-if="blok.title" v-reveal="blok.title">{{ blok.title }}</h2>
            <p v-if="blok.description" class="split-body">{{ blok.description }}</p>
        </div>
        <div v-if="blok.image?.filename" class="split-media">
            <img :src="sbImage(blok.image.filename, '1000x0')" :alt="blok.image.alt || blok.title || ''" loading="lazy" decoding="async">
        </div>
    </section>
</template>

<script setup>
defineProps({ blok: Object });
</script>
