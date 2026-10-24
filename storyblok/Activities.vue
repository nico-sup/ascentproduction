<template>
    <section v-editable="blok" class="container">
        <ul class="activities-grid">
            <li v-for="(item, index) in blok.item" :key="item._uid || index">
                <Activity :blok="item" />
            </li>
        </ul>
    </section>
</template>

<script setup>
    import Activity from '~/storyblok/Activity.vue';
    defineProps({ blok: Object })
</script>
