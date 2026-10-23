<template>
    <section v-editable="blok" class="mansory container">
        <ul>
             <li v-for="(asset, index) in blok.images" :key="asset.id || index" class="image-wrapper">
                 <button type="button" class="block w-full" @click="openLightbox(index)"
                    :aria-label="`Agrandir l'image ${index + 1}${asset.alt ? ' : ' + asset.alt : ''}`">
                    <img :src="sbImage(asset.filename, '800x0')" :alt="asset.alt || ''" class="object-cover h-full w-full"
                        loading="lazy" decoding="async" data-aos="zoom-in" :data-aos-delay="(index % 8) * 150" />
                 </button>
             </li>
        </ul>

        <div v-if="lightboxVisible" ref="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Galerie d'images"
            tabindex="-1" @click.self="closeLightbox" @keydown="handleKeyPress">
                 <button type="button" class="lightbox-close" @click="closeLightbox" aria-label="Fermer la galerie">
                    <svg width="32" height="32" viewBox="-0.5 0 25 25" fill="none" aria-hidden="true">
                        <path d="M3 21.32L21 3.32001M3 3.32001L21 21.32" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                 </button>
                 <Swiper
                     :initialSlide="selectedImageIndex"
                     :slides-per-view="1"
                     :loop="true"
                     @swiper="onSwiperUpdate"
                 >
                     <SwiperSlide v-for="(asset, index) in blok.images" :key="asset.id || index" @click.self="closeLightbox">
                         <img :src="sbImage(asset.filename, '1920x0')" :alt="asset.alt || ''" decoding="async" />
                     </SwiperSlide>
                     <button type="button" class="swiper-button-prev" @click.stop="prevImage" aria-label="Image précédente"></button>
                     <button type="button" class="swiper-button-next" @click.stop="nextImage" aria-label="Image suivante"></button>
                 </Swiper>
             </div>
    </section>
</template>
<script setup>
    import { ref, nextTick } from 'vue';

    defineProps({ blok: Object });

    const lightboxVisible = ref(false);
    const selectedImageIndex = ref(0);
    const lightbox = ref(null);
    let swiperInstance = null;

    const openLightbox = async (index) => {
        selectedImageIndex.value = index;
        lightboxVisible.value = true;
        await nextTick();
        lightbox.value?.focus(); // permet la navigation au clavier immédiatement
    };

    const closeLightbox = () => {
        lightboxVisible.value = false;
        swiperInstance = null;
    };

    const onSwiperUpdate = (swiper) => {
        swiperInstance = swiper;
    };

    // realIndex (et non activeIndex) car le mode "loop" duplique les slides
    const prevImage = () => {
        if (!swiperInstance) return;
        swiperInstance.slidePrev();
        selectedImageIndex.value = swiperInstance.realIndex;
    };

    const nextImage = () => {
        if (!swiperInstance) return;
        swiperInstance.slideNext();
        selectedImageIndex.value = swiperInstance.realIndex;
    };

    const handleKeyPress = (event) => {
        if (event.key === 'ArrowLeft') prevImage();
        else if (event.key === 'ArrowRight') nextImage();
        else if (event.key === 'Escape') closeLightbox();
    };
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

    .lightbox-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        height: 3rem;
        width: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 20;
    }

    .lightbox .swiper {
        width: 100%;
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
