<template>
    <section v-editable="blok" class="container">
        <div class="section-head">
            <span v-if="blok.tag" class="eyebrow">{{ blok.tag }}</span>
            <h2 v-reveal="blok.title" class="m-0">{{ blok.title }}</h2>
        </div>
        <ul class="category-grid">
            <li v-for="(item, index) in blok.items" :key="item._uid || index">
                <CategoryItem :blok="item" />
            </li>
        </ul>
        <div v-if="blok.link" class="mt-14">
            <NuxtLink class="button" to="/projects">Voir toutes les réalisations</NuxtLink>
        </div>
    </section>
</template>

<script setup>
    import CategoryItem from '~/storyblok/CategoryItem.vue';
    defineProps({ blok: Object })
</script>
