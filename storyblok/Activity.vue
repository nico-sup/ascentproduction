<template>
     <div v-editable="blok" data-aos="fade-up" data-aos-mirror="true" class="bg-green-light-ascent rounded-xl p-5 h-full">
        <div class="flex flex-col justify-start px-4 relative">
             <img v-if="blok.icon" :src="blok.icon.filename" :alt="blok.icon.alt" class="h-10 object-contain w-fit mb-5" />
             <h2 class="z-[2] text-white uppercase">{{ blok.title }}</h2>
             <p class="z-[2] text-white">{{ blok.description }}</p>
        </div>
    </div>
</template>

<script setup>
    defineProps({ blok: Object })
</script>