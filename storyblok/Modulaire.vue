<template>
    <section class="container wysiwyg" v-editable="blok">
      <div>
        <div v-html="resolvedRichText"></div>
      </div>
    </section>
  </template>

  <script setup>
  const props = defineProps({ blok: Object });

  const resolvedRichText = computed(() => renderRichText(props.blok.wysiwyg));
  </script>