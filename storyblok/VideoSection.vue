<template>
    <section v-editable="blok" class="container video-section">
        <div>
            <ul class="grid md:grid-cols-2">
                <li v-for="(item, index) in blok.items" :key="item._uid || index">
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
