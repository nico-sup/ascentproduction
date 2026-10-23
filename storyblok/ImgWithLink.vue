<template>
    <div v-editable="blok" class="h-full">
      <SbLink v-if="hasLink" :link="blok.link">
        <img :src="sbImage(blok.image?.filename, size)" :alt="blok.image?.alt || blok.image?.title || 'Référence client'"
          loading="lazy" decoding="async">
      </SbLink>
      <span v-else-if="blok.image?.filename" class="img-link-wrap">
        <img :src="sbImage(blok.image.filename, size)"
          :alt="blok.image?.alt || blok.image?.title || 'Référence client'" loading="lazy" decoding="async">
      </span>
    </div>
  </template>

  <script setup>
  const props = defineProps({ blok: Object, size: { type: String, default: '800x0' } })
  const hasLink = computed(() => !!resolveSbLink(props.blok.link).to)
  </script>
