<template>
  <div class="h-screen overflow-hidden hero-header grid">
    <video loop muted autoplay class="absolute h-full w-full object-cover z-[-1]">
      <source src="/videos/videoheader.mov" />
    </video>

    <nav class="flex justify-between container mt-5">
      <div class="logo" data-aos="fade-right">
        <a href="">Ascent Production</a>
      </div>

      <ul class="md:flex gap-10 hidden">
        <ol data-aos="fade-down">
          <a href="">L'entreprise</a>
        </ol>
        <ol data-aos="fade-down" data-aos-delay="100">
          <a href="">Services</a>
        </ol>
        <ol data-aos="fade-down" data-aos-delay="200">
          <a href="">Projets</a>
        </ol>
        <ol data-aos="fade-down" data-aos-delay="300">
          <a href="">Contact</a>
        </ol>
      </ul>

      <div>
        <button @click="toggleHeaderActive" data-aos="fade-left">
          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="#ffffff" stroke-width="1" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>

        <div :class="{ 'header-active': isActive }" class="level_0 layout-grid">

          <div class="col-span-3">
            <img class="h-full object-cover" src="/images/banner-nav.png" alt="" srcset="">
          </div>

          <ul class="flex gap-10 text-black col-span-8">
            <ol>
              <a href="">L'entreprise</a>
            </ol>
            <ol>
              <a href="">Services</a>
            </ol>
            <ol>
              <a href="">Projets</a>
            </ol>
            <ol>
              <a href="">Contact</a>
            </ol>
          </ul>

          <button @click="toggleHeaderActive" class="self-start items-end">
            <svg width="30px" height="30px" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 21.32L21 3.32001" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M3 3.32001L21 21.32" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>

        </div>

      </div>

    </nav>

    <div class="flex flex-col justify-end">
      <div class="marquee-container">
        <div class="marquee" ref="marquee">
          <span v-for="n in 10" :key="n">VIDÉASTE - TÉLÉPILOTE PROFESSIONEL - MONTEUR VIDÉO - PHOTROGRAPHIE - </span>
        </div>
      </div>

      <div class="scroll border-t border-t-white py-5 mt-10 flex justify-center items-center text-white">SCROLL</div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isActive = ref(false);

function toggleHeaderActive() {
  isActive.value = !isActive.value;
}

onMounted(() => {
  const marquee = document.querySelector('.marquee');
  const container = marquee.parentElement;

  let speed = 0.3; // Vitesse de défilement (pixels par frame)
  let startPosition = 0;

  function animate() {
    if (startPosition <= -marquee.scrollWidth / 2) {
      startPosition = 0;
    } else {
      startPosition -= speed;
    }
    marquee.style.transform = `translateX(${startPosition}px)`;
    requestAnimationFrame(animate);
  }

  animate();
});

</script>

<style scoped>
.marquee-container {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  color: white;
  padding: 10px 0;
  position: relative;
}

.marquee {
  display: inline-block;
  position: absolute;
  white-space: nowrap;
}
</style>
