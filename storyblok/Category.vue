<template>
    <section v-editable="blok" class="container layout-grid">
        <div class="col-span-4 md:col-span-2 place-content-center">
            <span data-aos="fade-up">{{ blok.tag }}</span>
            <h2 class="text-green-light-ascent" data-aos="fade-right">{{ blok.title }}</h2>
        </div>
        <div class="col-span-full md:col-span-10">
            <ul>
                <li v-for="(item, index) in blok.items" :key="index">
                    <CategoryItem :blok="item" />
                </li>
            </ul>
        </div>
        <div class="col-span-full text-right" v-if="blok.link">
            <NuxtLink class=" button" :to="'/projects'">Explorer les projets</NuxtLink>
        </div>
    </section>

</template>

<script setup>
    import CategoryItem from '~/storyblok/CategoryItem.vue';
    defineProps({ blok: Object })
</script>