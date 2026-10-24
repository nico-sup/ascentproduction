<template>
    <article v-editable="blok" class="article">
        <header class="page-hero">
            <div class="container page-hero-head">
                <div class="md:col-span-8">
                    <NuxtLink to="/projects" class="eyebrow link-line w-fit">Nos réalisations</NuxtLink>
                    <h1 v-if="blok.title" v-reveal class="page-hero-title">{{ blok.title }}</h1>
                </div>
                <p v-if="blok.description" class="page-hero-aside lede m-0">{{ blok.description }}</p>
            </div>
            <div v-if="blok.image?.filename" class="page-hero-frame">
                <img :src="sbImage(blok.image.filename, '1920x0')" :alt="blok.image.alt || blok.title || ''"
                    fetchpriority="high" decoding="async">
                <div class="viewfinder" aria-hidden="true"><span></span></div>
            </div>
        </header>

        <div v-for="content in blok.content" :key="content._uid">
            <component :is="componentMap[content.component]" v-if="componentMap[content.component]" :blok="content"></component>
            <StoryblokComponent v-else :blok="content" />
        </div>
    </article>
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
    import List from '~/storyblok/List.vue';
    import Slider from '~/storyblok/Slider.vue';
    import SliderImage from '~/storyblok/SliderImage.vue';
    import VideoBanner from '~/storyblok/VideoBanner.vue';
    import VideoSection from '~/storyblok/VideoSection.vue';
    import NousContacter from '~/storyblok/NousContacter.vue';
    import Activities from '~/storyblok/Activities.vue';

    const componentMap = {
        category: Category,
        video: Video,
        expertise: Expertise,
        descriptionImage: DescriptionImage,
        imageDescription: ImageDescription,
        mansory: Mansory,
        modulaire: Modulaire,
        heroSplit: HeroSplit,
        list: List,
        slider: Slider,
        sliderImage: SliderImage,
        videoBanner: VideoBanner,
        videoSection: VideoSection,
        nousContacter: NousContacter,
        activities: Activities,
    };

    defineProps({ blok: Object });
</script>
