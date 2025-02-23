<template>
    <div v-editable="blok" class="h-full">
      <template v-if="isInternalLink(blok.link)">
        <NuxtLink :to="getInternalLink(blok.link)">
          <img :src="blok.image.filename" alt="">
        </NuxtLink>
      </template>
      <template v-else>
        <a :href="blok.link.url" target="_blank" rel="noopener noreferrer">
          <img :src="blok.image.filename" alt="">
        </a>
      </template>
    </div>
  </template>
  
  <script setup>
  
 defineProps({ blok: Object })
  
  function isInternalLink(link) {
    return link.linktype === 'story';
  }
  
  function getInternalLink(link) {
    return `/${link.cached_url}`;
  }
  </script>
  