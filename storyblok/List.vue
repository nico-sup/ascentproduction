<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useNuxtApp } from "#app";
import ImgText from "~/storyblok/ImgText.vue";

defineProps({ blok: Object });

const { $gsap } = useNuxtApp();

const activeImage = ref(null);
const imageContainer = ref(null);
const showImage = ref(false);
const hoveredIndex = ref(null);
const isMobile = ref(false);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768; // Désactive l'effet sur mobile
};

const handleMouseEnter = async (item, index, event) => {
  if (isMobile.value) return; // Pas d'image sur mobile

  hoveredIndex.value = index;

  if (item.image?.filename) {
    activeImage.value = item.image.filename;
    showImage.value = true;

    await nextTick();

    if (imageContainer.value) {
      $gsap.set(imageContainer.value, {
        x: event.clientX + 20,
        y: event.clientY + 20,
        visibility: "visible",
      });

      $gsap.to(imageContainer.value, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }
};

const handleMouseLeave = () => {
  hoveredIndex.value = null;
  showImage.value = false;

  if (imageContainer.value) {
    $gsap.to(imageContainer.value, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  }
};

const handleMouseMove = (event) => {
  if (isMobile.value || !showImage.value || !imageContainer.value) return;

  $gsap.to(imageContainer.value, {
    x: event.clientX + 20,
    y: event.clientY + 20,
    duration: 0.1,
    ease: "power2.out",
  });
};

const handleScroll = () => {
  if (isMobile.value) return;

  showImage.value = false; // Cache l'image quand on scroll
  hoveredIndex.value = null;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <section class="container">
    <ul class="layout-grid">
      <li
        v-for="(item, index) in blok.item"
        :key="index"
        @mouseenter="(event) => handleMouseEnter(item, index, event)"
        @mouseleave="handleMouseLeave"
        :class="{
          'blur-effect': hoveredIndex !== null && hoveredIndex !== index,
          'active-text': hoveredIndex === index,
        }"
        class="col-span-full z-[2]"
      >
        <ImgText :blok="item" />
      </li>
    </ul>

    <div v-if="!isMobile && showImage && activeImage" ref="imageContainer" class="hover-image">
      <img :src="activeImage" alt="Image associée" />
    </div>
  </section>
</template>

<style scoped>
.container {
  position: relative;
}

.layout-grid {
  list-style: none;
  padding: 0;
}

li {
  cursor: pointer;
  padding: 10px;
  transition: filter 0.3s ease, opacity 0.3s ease, color 0.3s ease;
}

/* Effet de flou et opacité pour les éléments non actifs */
.blur-effect {
  filter: blur(5px);
  opacity: 0.6;
}

/* Image flottante */
.hover-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 150px;
  height: 250px;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, -50%) rotate(10deg);
}

.hover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}
</style>
