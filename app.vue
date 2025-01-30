<template>
    <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.min.css">
    </head>
    <NuxtLayout>
        <Header />
        <NuxtPage />
        <Footer />
    </NuxtLayout>
</template>

<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
</script>