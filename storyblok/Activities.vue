<template>
    <section v-editable="blok" class="container">
            <ul class="layout-grid">
                <li v-for="(items, index) in blok.item" :key="index" class="col-span-full md:col-span-4 h-full">
                    <Activity :blok="items" />
                </li>
            </ul>
    </section>

</template>

<script setup>
    import Activity from '~/storyblok/Activity.vue';
    defineProps({ blok: Object })
</script>