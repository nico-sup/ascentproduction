<template>
    <section class="mansory container">
        <ul>
             <li v-for="(asset, index) in blok.images" :key="index" class="image-wrapper">
                 <img :src="asset.filename" :alt="'Image ' + (index + 1)" @click="openLightbox(index)" class="object-cover h-full w-full"   data-aos="zoom-in" :data-aos-delay="index * 150"/>
             </li>
        </ul>

        <div v-if="lightboxVisible" class="lightbox" @click="closeLightbox" tabindex="0" @keydown="handleKeyPress" >
                 <Swiper 
                     :initialSlide="selectedImageIndex"
                     :slides-per-view="1"
                     :loop="true"
                     @swiper="onSwiperUpdate"
                 >
                     <SwiperSlide v-for="(asset, index) in blok.images" :key="index">
                         <img :src="asset.filename" :alt="'Image ' + (index + 1)" />
                     </SwiperSlide>
                     <div ref="prevButton" class="swiper-button-prev"  @click.stop="prevImage"></div>
                     <div ref="nextButton" class="swiper-button-next"  @click.stop="nextImage"></div>
                 </Swiper>
             </div>
    </section>
</template>
<script setup>
    import { ref } from 'vue';

    defineProps({ blok: Object });

    const lightboxVisible = ref(false);
    const selectedImageIndex = ref(0);
    let swiperInstance;
    const prevButton = ref(null);
    const nextButton = ref(null);

    const openLightbox = (index) => {
        selectedImageIndex.value = index;
        lightboxVisible.value = true;
    };

    const closeLightbox = () => {
        lightboxVisible.value = false;
    };

    const onSwiperUpdate = (swiper) => {
        swiperInstance = swiper;
    };

    const prevImage = () => {
        if (swiperInstance) {
            swiperInstance.slidePrev();
            selectedImageIndex.value = swiperInstance.activeIndex;
        }
    };

    const nextImage = () => {
        if (swiperInstance) {
            swiperInstance.slideNext();
            selectedImageIndex.value = swiperInstance.activeIndex;
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'ArrowLeft') {
            prevImage();
        } else if (event.key === 'ArrowRight') {
            nextImage();
        }
    }
</script>


<style scoped>
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .lightbox::after {
        content: "";
        position: absolute;
        top: 1rem;
        right: 1rem;
        height: 3rem;
        width: 3rem;
        background-image: url('/images/icons/close-white.svg');
        background-size: contain;
    }


    .lightbox .swiper-slide {
        height: auto;
        display: flex;
        align-items: center;
    }


    .lightbox img {
        max-width: 60%;
        height: 60%;
        object-fit: contain;
        margin: auto;
        @media screen and (max-width:1024px) {
            height: 90%;
            max-width: 70%;
        }
    }

    .swiper-button-prev,
    .swiper-button-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 30px;
        height: 30px;
        z-index: 10;
    }

    .swiper-button-prev {
        left: 10px;
    }

    .swiper-button-next {
        right: 10px;
    }
</style>
