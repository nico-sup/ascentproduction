<template>
    <section v-editable="blok" class="container">
        <div class="slider_image">
            <Swiper
                :modules="[SwiperAutoplay]"
                :slides-per-view="1"
                :loop="true"
                :space-between="10"
                :speed="1000"
                :autoplay="{
                    delay: 3000,
                    disableOnInteraction: false,
                }">
                <SwiperSlide v-for="(imgWithLink, index) in blok.slide_image" :key="index">
                    <ImgWithLink class="min-h-[50vh] md:min-h-[65vh]" :blok="imgWithLink" size="1600x0" />
                </SwiperSlide>
                </Swiper>
            </div>
    </section>
  </template>


  <script setup>
  import ImgWithLink from '~/storyblok/ImgWithLink.vue';
  defineProps({ blok: Object });
  </script>
  