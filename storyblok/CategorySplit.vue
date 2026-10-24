<template>
  <article v-editable="blok" class="category-split" :class="hasLink ? 'has-link' : 'no-link'">
    <div class="relative">
      <div class="category-split-media media-zoom">
        <video
          v-if="blok.video?.filename"
          v-lazy-video
          :data-src="blok.video.filename"
          autoplay
          loop
          muted
          playsinline
          preload="none"
          aria-hidden="true"
        ></video>
        <img
          v-else-if="blok.image?.filename"
          :src="sbImage(blok.image.filename, '1000x0')"
          :alt="blok.image.alt || blok.title || ''"
          loading="lazy"
          decoding="async"
        />
      </div>
      <h3 class="caption-title">{{ blok.title }}</h3>
      <p v-if="blok.subtitle" class="caption-sub">{{ blok.subtitle }}</p>
      <SbLink :link="blok.link" :aria-label="blok.title" class="absolute inset-0 z-[2]" />
    </div>
  </article>
</template>

<script setup>
const props = defineProps({ blok: Object, index: Number });
const hasLink = computed(() => !!resolveSbLink(props.blok.link).to);
</script>
