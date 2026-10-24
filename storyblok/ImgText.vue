<template>
     <div v-editable="blok" class="imgtext">
        <h2 class="imgtext-title">{{ blok.title }}</h2>
    </div>
</template>

<script setup>
    // L'image associée est affichée au survol par le composant List
    defineProps({ blok: Object })
</script>
