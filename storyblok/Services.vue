<template>
  <section v-editable="blok" class="container border-y border-y-green-ascent py-5 layout-grid">
    <div class="col-span-3 grid grid-cols-3 items-start gap-3">
        <img :src="blok.img.filename" alt="" class="w-full h-[15rem] object-cover col-span-2">
        <p class="mt-0 text-green-ascent font-bold">{{ blok.number }}</p>
    </div>

    <div class="col-span-6 flex flex-col">
        <h2 class="font-chewy flex-1">{{ blok.title }}</h2>
        <h3 class="text-[1rem] bg-green-ascent w-fit text-white px-2">{{ blok.tag }}</h3>

    </div>

  </section>
</template>

<script setup>
defineProps({ blok: Object });
</script>
