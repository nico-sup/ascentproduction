<template>
    <NuxtLink :to="'/' + slug" v-editable="article" class="article-card">
        <img :src="article.image.filename" alt="">
        <h2>{{ article.title }}</h2>
        <p>{{ article.description }}</p>
    </NuxtLink>
</template>

<script setup>
    defineProps({ article: Object, slug: String })
</script>