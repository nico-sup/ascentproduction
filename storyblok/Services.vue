<template>
  <section v-editable="blok" class="border-t border-t-green-ascent services my-0">
    <div class="container layout-grid py-5 my-0">
        <div class="col-span-3 hidden md:grid grid-cols-3 items-start gap-3">
            <img :src="blok.img.filename" alt="" class="w-full h-[15rem] object-cover col-span-2 rounded-3xl">
            <p class="mt-0 text-green-ascent font-bold">{{ blok.number }}</p>
        </div>
    
        <div class="col-span-6 flex flex-col">
            <h2 class="font-chewy flex-1">{{ blok.title }}</h2>
            <h3 class="text-[1rem] bg-green-ascent w-fit text-white px-2">{{ blok.tag }}</h3>
    
        </div>
    </div>

  </section>
</template>

<script setup>
defineProps({ blok: Object });
</script>
