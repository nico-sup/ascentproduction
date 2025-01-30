<template>
  <section v-editable="blok" class="w-full bg-[#f7f6fd] rounded-[5px] text-center">
    <h1 class="text-green-ascent" data-aos="zoom-in">
      {{ blok.name }}
    </h1>
  </section>
</template>

<script setup>
defineProps({ blok: Object });
</script>
