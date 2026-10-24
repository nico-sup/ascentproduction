<template>
    <NuxtLink :to="'/' + slug" v-editable="article" class="article-card">
        <div class="article-card-media media-zoom">
            <img v-if="article.image?.filename" :src="sbImage(article.image.filename, '1200x0')"
                :alt="article.image.alt || article.title || ''" loading="lazy" decoding="async">
        </div>
        <h2 class="caption-title">{{ article.title }}</h2>
        <p v-if="article.description" class="caption-sub line-clamp-2 max-w-[52ch]">{{ article.description }}</p>
    </NuxtLink>
</template>

<script setup>
    defineProps({ article: Object, slug: String })
</script>
