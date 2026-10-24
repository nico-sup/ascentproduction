<template>
    <section v-editable="blok" class="container contact-band">
        <div class="contact-band-media">
            <img v-if="blok.image?.filename" :src="sbImage(blok.image.filename, '1600x0')" :alt="blok.image.alt || ''"
                loading="lazy" decoding="async">
            <div class="viewfinder" aria-hidden="true"><span></span></div>
        </div>
        <NuxtLink class="contact-band-link" to="/contact">
            <span v-reveal>Une demande, un projet ?</span>
            <span class="contact-band-cta">Écrivez-moi</span>
        </NuxtLink>
    </section>
</template>

<script setup>
defineProps({ blok: Object });
</script>
