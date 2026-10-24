<template>
     <article v-editable="blok" class="category-item">
        <SbLink v-if="hasLink" :link="blok.link" class="block">
            <div class="category-item-media media-zoom">
                <img v-if="blok.image?.filename" :src="sbImage(blok.image.filename, '1200x0')" :alt="blok.image.alt || blok.title || ''"
                    loading="lazy" decoding="async" />
            </div>
            <h3 class="caption-title">{{ blok.title }}</h3>
            <p v-if="blok.subtitle" class="caption-sub">{{ blok.subtitle }}</p>
        </SbLink>
        <template v-else>
            <div class="category-item-media">
                <img v-if="blok.image?.filename" :src="sbImage(blok.image.filename, '1200x0')" :alt="blok.image.alt || blok.title || ''"
                    loading="lazy" decoding="async" />
            </div>
            <h3 class="caption-title">{{ blok.title }}</h3>
            <p v-if="blok.subtitle" class="caption-sub">{{ blok.subtitle }}</p>
        </template>
     </article>
</template>

<script setup>
    const props = defineProps({ blok: Object })
    const hasLink = computed(() => !!resolveSbLink(props.blok.link).to)
</script>
