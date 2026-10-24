<template>
     <div v-editable="blok" class="activity">
        <span v-if="blok.icon?.filename" class="activity-icon">
            <img :src="sbImage(blok.icon.filename, '160x0')" :alt="blok.icon.alt || ''" loading="lazy" decoding="async" />
        </span>
        <h3>{{ blok.title }}</h3>
        <p class="m-0">{{ blok.description }}</p>
    </div>
</template>

<script setup>
    defineProps({ blok: Object })
</script>
