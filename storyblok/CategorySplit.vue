<template>
  <section
    v-editable="blok"
    class="category-split my-4"
    :class="hasLink ? 'has-link' : 'no-link'"
    data-aos="fade-up"
    :data-aos-delay="(index || 0) * 300"
  >
    <div class="flex flex-col justify-center relative">
      <template v-if="blok.video?.filename">
        <video
          v-lazy-video
          :data-src="blok.video.filename"
          class="w-full h-[40vh] md:h-[70vh] object-cover z-0 mb-3"
          autoplay
          loop
          muted
          playsinline
          preload="metadata"
          aria-hidden="true"
        ></video>
      </template>
      <template v-else-if="blok.image?.filename">
        <img
          :src="sbImage(blok.image.filename, '1000x0')"
          :alt="blok.image.alt || blok.title || ''"
          class="w-full h-[40vh] md:h-[70vh] object-cover z-0 mb-3"
          loading="lazy"
          decoding="async"
        />
      </template>

      <h3 class="z-[2] text-[1.3rem] uppercase">{{ blok.title }}</h3>
      <p class="z-[2] text-[1rem] mt-0 mb-4">{{ blok.subtitle }}</p>
      <SbLink :link="blok.link" :aria-label="blok.title" class="absolute z-[2] top-0 left-0 h-full w-full" />
    </div>
  </section>
</template>

<script setup>
const props = defineProps({ blok: Object, index: Number });
const hasLink = computed(() => !!resolveSbLink(props.blok.link).to);
</script>
