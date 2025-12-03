<template>
    <section class="container">
        <div v-editable="blok" class="slider">
            <Swiper
                :modules="[SwiperAutoplay]"
                :slides-per-view="2"
                :loop="true"
                :space-between="10"
                :speed="1000"
                :autoplay="{
                    delay: 3000,
                    disableOnInteraction: false,
                }"
                :breakpoints="{
                    768: { slidesPerView: 3 },
                }">
                <SwiperSlide v-for="(imgWithLink, index) in blok.slide_image" :key="index">
                    <ImgWithLink class="h-[20vh] md:h-[35vh]" :blok="imgWithLink" />
                </SwiperSlide>
                </Swiper>
            </div>
    </section>
  </template>

  <script setup>
  import ImgWithLink from '~/storyblok/ImgWithLink.vue';
  defineProps({ blok: Object });
  </script>
  