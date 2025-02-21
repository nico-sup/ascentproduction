<template>
    <div v-editable="blok" class="article">
        <div class="banner mb-24">
            <img class="z-[1]" v-if="blok.image" :src="blok.image.filename" alt="">
            <h1 v-if="blok.title">{{ blok.title }}</h1>
            <p v-if="blok.description" class="max-w-[60%] text-center">{{ blok.description }}</p>
        </div>

        <div v-for="(content, index) in blok.content" :key="index">
            <component :is="componentMap[content.component]" :blok="content"></component>
        </div>
    </div>
</template>

<script setup>
    import Category from '~/storyblok/Category.vue';
    import Expertise from '~/storyblok/Expertise.vue';
    import ImageDescription from '~/storyblok/ImageDescription.vue';
    import DescriptionImage from '~/storyblok/DescriptionImage.vue';
    import Mansory from '~/storyblok/Mansory.vue';
    import Video from '~/storyblok/Video.vue';
    import Modulaire from '~/storyblok/Modulaire.vue';
    import HeroSplit from '~/storyblok/HeroSplit.vue';
    
    const componentMap = {
        category: Category,
        video: Video,
        expertise: Expertise,
        descriptionImage: DescriptionImage,
        imageDescription: ImageDescription,
        mansory: Mansory,
        modulaire: Modulaire,
        heroSplit: HeroSplit
    };

    defineProps({ blok: Object });
</script>   