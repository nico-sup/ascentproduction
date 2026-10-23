<template>
     <div v-editable="blok" data-aos="fade-up" data-aos-mirror="true" class="col-span-full text-center">
        <h2 class="z-[2] uppercase text-xl md:text-[4rem] md:leading-[4rem]">{{ blok.title }}</h2>
    </div>
</template>

<script setup>
    // L'image associée est affichée au survol par le composant List (plus de chargement d'image cachée)
    defineProps({ blok: Object })
</script>
