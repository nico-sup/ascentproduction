<template>
    <div v-editable="blok" class="flex flex-col items-center border-t-2 pt-4 border-t-black video-bloc p-4">
        <span class="text-right w-full">({{ blok.number }})</span>
        <h3 class="text-center">{{ blok.title }}</h3>
        <div class="w-[60vw] h-[30vw] md:w-[32vw] md:h-[20vw] overflow-hidden">
            <video autoplay muted loop playsinline class="h-full w-full object-cover scale-125" >
                <source :src="blok.asset.filename" />
          </video>
        </div>
      <div class="flex w-full justify-between mt-6 px-6">
        <h4 class="text-xs">{{ blok.tag_one }}</h4>
        <h4 class="text-xs">{{ blok.tag_two }}</h4>
        <h4 class="text-xs">{{ blok.tag_three }}</h4>
      </div>
    </div>
</template>

<script setup>
defineProps({ blok: Object });
</script>
