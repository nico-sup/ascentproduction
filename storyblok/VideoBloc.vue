<template>
    <div v-editable="blok" class="video-bloc">
        <div class="video-bloc-top">
            <h3 class="m-0">{{ blok.title }}</h3>
            <span class="video-bloc-num"><span class="dot" aria-hidden="true"></span>{{ blok.number }}</span>
        </div>
        <div class="video-bloc-media media-zoom">
            <video v-if="blok.asset?.filename" v-lazy-video :data-src="blok.asset.filename" autoplay muted loop playsinline preload="none" aria-hidden="true"></video>
        </div>
        <ul class="video-bloc-tags">
            <li v-if="blok.tag_one">{{ blok.tag_one }}</li>
            <li v-if="blok.tag_two">{{ blok.tag_two }}</li>
            <li v-if="blok.tag_three">{{ blok.tag_three }}</li>
        </ul>
    </div>
</template>

<script setup>
defineProps({ blok: Object });
</script>
