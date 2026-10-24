<template>
    <section v-editable="blok" class="container">
        <h2 v-reveal class="mb-12">Ils nous ont fait confiance</h2>
        <div class="slider">
            <Swiper
                :modules="[SwiperAutoplay]"
                :slides-per-view="3"
                :loop="true"
                :space-between="24"
                :speed="1000"
                :autoplay="{
                    delay: 3000,
                    disableOnInteraction: false,
                }"
                :breakpoints="{
                    768: { slidesPerView: 5 },
                }">
                <SwiperSlide v-for="(imgWithLink, index) in blok.slide" :key="imgWithLink._uid || index">
                    <ImgWithLink class="h-[14vh] md:h-[20vh]" :blok="imgWithLink" />
                </SwiperSlide>
                </Swiper>
            </div>
    </section>
  </template>

  <script setup>
  import ImgWithLink from '~/storyblok/ImgWithLink.vue';
  defineProps({ blok: Object });
  </script>
  