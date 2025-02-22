<template>
    <section v-editable="blok" class="container-full layout-grid video-section">
        <div class="col-span-full">
            <ul class="grid md:grid-cols-2">
                <li v-for="(item, index) in blok.items" :key="index">
                    <VideoBloc :blok="item" :index="index" />
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup>
import VideoBloc from '~/storyblok/VideoBloc.vue';
defineProps({ blok: Object });
</script>
