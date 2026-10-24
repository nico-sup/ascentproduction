<template>
    <section v-editable="blok" class="container">
        <ul class="activities-grid" :class="{ 'is-two': [2, 4].includes((blok.item || []).length) }">
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
