<template>
    <section v-editable="blok" class="container layout-grid">
        <div class="place-content-center col-span-full">
            <span data-aos="fade-right">{{ blok.tag }}</span>
            <h2 data-aos="fade-right">{{ blok.title }}</h2>
        </div>
        <div class="col-span-full">
            <ul class="grid md:grid-cols-3 gap-4">
                <li v-for="(item, index) in blok.items" :key="index">
                    <CategorySplit :blok="item" :index="index" />
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup>
import CategorySplit from '~/storyblok/CategorySplit.vue';
defineProps({ blok: Object });
</script>
