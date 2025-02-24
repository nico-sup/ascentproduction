<template>
    <section class="container-full ">
        <div v-editable="blok" class="layout-grid hero-split !gap-0">
      
          <div class="col-span-full md:col-span-8 hero-split__left">
              <img class="bg-img rounded-none" v-if="blok.bg_left" :src="blok.bg_left.filename" :alt="blok.bg_left.alt" alt="">
              <img class="z-[1] img-left" v-if="blok.img_left.filename" :src="blok.img_left.filename" :alt="blok.img_left.alt" alt="">
              <span>{{ blok.description_left }}</span>
          </div>
      
          <div class="col-span-full md:col-span-4 hero-split__right">
            <img class="bg-img rounded-none" v-if="blok.bg_right" :src="blok.bg_right.filename" :alt="blok.bg_right.alt" alt="">

            <div class="top">
                <span>{{ blok.top_description_right }}</span>
            </div>

            <div class="center z-[2] flex justify-center items-center flex-col">
                <h2 class="text-white uppercase text-[3rem] z-[3]">{{ blok.center_description_right }}</h2>
                <img class="w-[35%] h-[40%] -translate-y-7" v-if="blok.img_right.filename" :src="blok.img_right.filename" :alt="blok.img_right.alt" alt="">
            </div>

            <p>{{ blok.bottom_description_right }}</p>
            
          </div>
      
        </div>
    </section>
</template>

<script setup>
defineProps({ blok: Object })
</script>