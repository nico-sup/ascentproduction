<template>
     <section v-editable="blok" class="category-item my-4" data-aos="fade-up" data-aos-mirror="true">
        <div class="h-[25rem] flex flex-col justify-center px-4 relative">
             <img v-if="blok.image" :src="blok.image.filename" :alt="blok.image.alt" class="absolute top-0 left-0 w-full h-full object-cover z-0" />
             <h2 class="z-[2] text-white uppercase">{{ blok.title }}</h2>
             <h4 class="z-[2] text-white">{{ blok.subtitle }}</h4>
              <a :href="blok.link.url" target="_blank" rel="noopener noreferrer"></a>
        </div>
     </section>
</template>

<script setup>
    defineProps({ blok: Object })
</script>