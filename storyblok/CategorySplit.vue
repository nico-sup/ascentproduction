<template>
  <section 
    v-editable="blok" 
    class="category-split my-4" 
    data-aos="fade-up"
    :data-aos-delay="index * 300"
  >
    <div class="flex flex-col justify-center relative">
      <img 
        v-if="blok.image" 
        :src="blok.image.filename" 
        :alt="blok.image.alt" 
        class="w-full h-[70vh] object-cover z-0 mb-3" 
      />
      <h2 class="z-[2] uppercase">{{ blok.title }}</h2>
      <h4 class="z-[2]">{{ blok.subtitle }}</h4>
      <a :href="blok.link.url" target="_blank" rel="noopener noreferrer"></a>
    </div>
  </section>
</template>

<script setup>
defineProps({ blok: Object, index: Number });
</script>
