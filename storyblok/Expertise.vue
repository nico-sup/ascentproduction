<template>
    <section v-editable="blok" class="container">
        <div class="section-head">
            <span v-if="blok.tag" class="eyebrow">{{ blok.tag }}</span>
            <h2 v-reveal class="m-0">{{ blok.title }}</h2>
        </div>
        <ul class="expertise-grid" :class="{ 'is-two': (blok.items || []).length === 2 }">
            <li v-for="(item, index) in blok.items" :key="item._uid || index">
                <CategorySplit :blok="item" :index="index" />
            </li>
        </ul>
    </section>
</template>

<script setup>
import CategorySplit from '~/storyblok/CategorySplit.vue';
defineProps({ blok: Object });
</script>
