<template>
  <section 
    v-editable="blok" 
    class="category-split my-4" 
    :class="{'has-link': blok.link.url || isInternalLink(blok.link), 'no-link': !blok.link.url && !isInternalLink(blok.link)}" 
    data-aos="fade-up"
    :data-aos-delay="index * 300"
  >
    <div class="flex flex-col justify-center relative">
      <template v-if="blok.video">
        <video 
          :src="blok.video.filename" 
          class="w-full h-[40vh] md:h-[70vh] object-cover z-0 mb-3" 
          autoplay 
          loop 
          muted 
          playsinline
        ></video>
      </template>
      <template v-else-if="blok.image">
        <img 
          :src="blok.image.filename" 
          :alt="blok.image.alt || 'Media'" 
          class="w-full h-[40vh] md:h-[70vh] object-cover z-0 mb-3" 
        />
      </template>

      <h2 class="z-[2] text-[1.7rem] uppercase">{{ blok.title }}</h2>
      <h4 class="z-[2]">{{ blok.subtitle }}</h4>
      <template v-if="isInternalLink(blok.link)">
        <NuxtLink :to="getInternalLink(blok.link)" class="absolute top-0 left-0 h-full w-full"></NuxtLink>
      </template>
      <template v-else>
        <a v-if="blok.link.url" :href="blok.link.url" class="absolute top-0 left-0 h-full w-full" rel="noopener noreferrer"></a>
      </template>
    </div>
  </section>
</template>

<script setup>
defineProps({ blok: Object, index: Number });

function isInternalLink(link) {
  return link.linktype === 'story';
}

function getInternalLink(link) {
  return `/${link.cached_url}`;
}
</script>
