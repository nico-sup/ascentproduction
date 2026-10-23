<template>
    <NuxtLink :to="'/' + slug" v-editable="article" class="article-card">
        <div class="flex justify-center items-center relative h-[30vh] md:h-[50vh]">
            <img v-if="article.image?.filename" class="absolute top-0 left-0 w-full h-full"
                :src="sbImage(article.image.filename, '1200x0')" :alt="article.image.alt || article.title || ''"
                loading="lazy" decoding="async">
            <h2 class="z-[2] text-white">{{ article.title }}</h2>
        </div>
    </NuxtLink>
</template>

<script setup>
    defineProps({ article: Object, slug: String })
</script>
