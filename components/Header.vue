<template>
  <header class="navigation grid z-10 w-full top-0 fixed">
    <nav class="flex justify-between items-center container py-5 z-[1]" aria-label="Navigation principale">
      <div class="logo" data-aos="fade-right">
        <NuxtLink to="/" aria-label="Ascent Production – accueil">
          <img src="/images/logo.webp" class="z-[1] h-14 w-auto" width="282" height="56"
            alt="Ascent Production, production audiovisuelle à Clermont-Ferrand" fetchpriority="high">
        </NuxtLink>
      </div>

      <div>
        <button type="button" @click="toggleHeaderActive" data-aos="fade-left"
          aria-label="Ouvrir le menu" :aria-expanded="isActive" aria-controls="menu-principal">
          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="#ffffff" stroke-width="1" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>

        <div id="menu-principal" :class="{ 'header-active': isActive }" class="level_0 flex flex-col p-5 z-10">

          <button type="button" @click="toggleHeaderActive" class="self-start flex justify-end self-end col-start-8"
            aria-label="Fermer le menu">
            <svg width="30px" height="30px" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M3 21.32L21 3.32001" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M3 3.32001L21 21.32" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>

          <ul class="flex gap-10 flex-col justify-center items-center text-black col-span-8 flex-1">
            <li v-for="item in menu" :key="item.to" @click="closeMenu">
              <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const isActive = ref(false);

const menu = [
  { to: '/', label: 'Accueil' },
  { to: '/projects', label: 'Nos réalisations' },
  { to: '/nos-expertises', label: 'Nos expertises' },
  { to: '/production-audiovisuelle', label: 'Production audiovisuelle' },
  { to: '/site-internet', label: 'Création de site internet' },
  { to: '/contact', label: 'Contact' },
];

function toggleHeaderActive() {
  isActive.value = !isActive.value;
}

function closeMenu() {
  isActive.value = false;
}

// Fermer le menu avec la touche Échap
if (import.meta.client) {
  const onKey = (e) => { if (e.key === 'Escape') closeMenu() }
  onMounted(() => window.addEventListener('keydown', onKey))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
}
</script>
