<template>
    <div v-editable="blok" class="article">
        <!-- <div class="banner">
            <img v-if="blok.image" :src="blok.image.filename" alt="">
            <h1 v-if="blok.title">{{ blok.title }}</h1>
            <p v-if="blok.description" class="max-w-[60%] text-center">{{ blok.description }}</p>
        </div>

        <div v-for="(content, index) in blok.content" :key="index">
            <component :is="componentMap[content.component]" :blok="content"></component>
        </div> -->
    </div>
</template>

<script setup>
    // import Feature from '~/storyblok/Feature.vue';
    // import Split from '~/storyblok/Split.vue';
    // import Slider from '~/storyblok/Slider.vue';
    
    // const componentMap = {
    //     feature: Feature,
    //     split: Split,
    //     slider: Slider,
    // };

    defineProps({ blok: Object });
</script>   