<template>
    <section class="layout-grid split">

        <div class="col-span-6 max-h-[30vh] md:max-h-none md:col-span-7 bg-red-400 col-start-1 h-screen">
            <img :src="blok.img_large.filename" alt="" class="h-full w-full object-cover">
        </div>

        <div class="col-span-6 md:col-span-4 grid">
            <img :src="blok.img_small.filename" alt="" class="h-40 w-40 md:w-20 mb-5 md:mb-0 object-cover">
            <div class="flex flex-col items-center max-w-[80%] md:max-w-[60%] mx-auto">
                <h2> {{ blok.title }}</h2>
                <p>{{ blok.description }}</p>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({ blok: Object });
</script>
