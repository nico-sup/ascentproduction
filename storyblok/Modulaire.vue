<template>
    <section class="container wysiwyg" v-editable="blok">
      <div>
        <div v-html="resolvedRichText"></div>
      </div>
    </section>
  </template>

  <script setup>
  const props = defineProps({ blok: Object });

  // Images du texte riche redimensionnées (avant : photos chargées en pleine résolution, jusqu'à 1 Mo)
  const resolvedRichText = computed(() => optimizeRichTextImages(renderRichText(props.blok.wysiwyg)));
  </script>