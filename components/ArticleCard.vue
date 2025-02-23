<template>
    <NuxtLink :to="'/' + slug" v-editable="article" class="article-card">
        <div class="flex justify-center items-center relative h-[30vh] md:h-[50vh]">
            <img class="absolute top-0 left-0 w-full h-full" :src="article.image.filename" alt="">
            <h2 class="z-[2] text-white">{{ article.title }}</h2>
        </div>
    </NuxtLink>
</template>

<script setup>
    defineProps({ article: Object, slug: String })
</script>